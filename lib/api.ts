const BASE_URL = "https://fakestoreapi.com";

type Primitive = string | number | boolean;
type NextFetchOptions = {
  revalidate?: number;
  tags?: string[];
};

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown>;
  query?: Record<string, Primitive | null | undefined>;
  next?: NextFetchOptions;
};

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function buildUrl(
  endpoint: string,
  query?: ApiFetchOptions["query"],
): string {
  const url = new URL(endpoint, BASE_URL);

  if (!query) {
    return url.toString();
  }

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

function isPlainObject(value: ApiFetchOptions["body"]): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !(value instanceof FormData);
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  try {
    return isJson ? await response.json() : await response.text();
  } catch {
    throw new ApiError(
      "The Fake Store API returned an unreadable response. Please try again in a moment.",
      502,
    );
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, headers, query, ...restOptions } = options;
  const requestHeaders = new Headers(headers);

  let requestBody: BodyInit | undefined;

  if (isPlainObject(body)) {
    requestHeaders.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  } else {
    requestBody = body;
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(endpoint, query), {
      ...restOptions,
      body: requestBody,
      headers: requestHeaders,
    });
  } catch {
    throw new ApiError(
      "We could not reach the Fake Store API. Please try again in a moment.",
      503,
    );
  }

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const message =
      typeof responseBody === "object" &&
      responseBody !== null &&
      "message" in responseBody &&
      typeof responseBody.message === "string"
        ? responseBody.message
        : "Something went wrong while fetching data.";

    throw new ApiError(message, response.status, responseBody);
  }

  return responseBody as T;
}