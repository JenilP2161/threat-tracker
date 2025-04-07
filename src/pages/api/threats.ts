import { NextApiRequest, NextApiResponse } from "next";
import { rateLimit } from "@/middleware/rateLimit";

// Define the Threat interface
interface Threat {
  host: string;
  url: string;
  threat_type: string;
  date_added: string;
}

// Sorting and Filtering logic
const sortAndFilterThreats = (
  threats: Threat[],
  sortBy: keyof Threat,
  order: "asc" | "desc",
  filterType?: string
): Threat[] => {
  let filtered = threats;

  // Apply filtering
  if (filterType) {
    filtered = filtered.filter((item) =>
      item.threat_type.toLowerCase().includes(filterType.toLowerCase())
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle date sorting (ensure valid date comparison)
    if (sortBy === "date_added") {
      aValue = new Date(aValue).getTime().toString();
      bValue = new Date(bValue).getTime().toString();
    }

    // Ascending or descending order comparison
    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
};

// Main API handler// In-memory cache object to store data temporarily
const cache: Record<string, any> = {};

// Function to sanitize the filter input (remove dangerous characters)
const sanitizeInput = (input: string) => {
  // Remove anything that's not a letter, number, or space
  return input.replace(/[^a-zA-Z0-9_ ]/g, "");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    page = 1,
    limit = 10,
    sortBy = "date_added",
    order = "desc",
    filterType,
  } = req.query;

  // Sanitize input before use
  const sanitizedFilterType = filterType
    ? sanitizeInput(filterType as string)
    : "";

  // Cache key as before (used for dynamic cache control)
  const cacheKey = `threats:${page}:${limit}:${sortBy}:${order}:${
    sanitizedFilterType || ""
  }`;

  // Apply rate limiting
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
  if (!rateLimit(ip.toString())) {
    return res
      .status(429)
      .json({ status: "error", message: "Too many requests" });
  }

  // Check if the data is in the cache
  if (cache[cacheKey]) {
    return res.status(200).json({
      status: "success",
      page: Number(page),
      limit: Number(limit),
      total: cache[cacheKey].total,
      threats: cache[cacheKey].threats,
    });
  }

  // Fetch data from the external API if not in cache
  const apiUrl = "https://urlhaus-api.abuse.ch/v1/urls/recent/limit/500/";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Map raw data to the Threat type
    let threats: Threat[] = data.urls.map((item: any) => ({
      host: item.host,
      url: item.url,
      threat_type: item.threat || "unknown",
      date_added: item.date_added,
    }));

    // Apply sorting and filtering
    threats = sortAndFilterThreats(
      threats,
      sortBy as keyof Threat,
      order as "asc" | "desc",
      sanitizedFilterType as string
    );

    // Pagination: slice data based on page and limit
    const start = (Number(page) - 1) * Number(limit);
    const paginatedThreats = threats.slice(start, start + Number(limit));

    // Store data in the cache
    cache[cacheKey] = {
      threats: paginatedThreats,
      total: threats.length,
    };

    // Cache-Control: Cache the response in the browser for 5 minutes
    res.setHeader(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=60"
    ); // 5 minutes cache + revalidate after 1 minute

    // Send the response with caching headers
    res.status(200).json({
      status: "success",
      page: Number(page),
      limit: Number(limit),
      total: threats.length,
      threats: paginatedThreats,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch data from external API",
    });
  }
}
