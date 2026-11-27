/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "../app/api/download/route";

const SSW_FILE =
  "https://raw.githubusercontent.com/SSWConsulting/SSW.Website/main/public/logo.svg";

function download(url: string) {
  return GET(
    new NextRequest(`https://yakshaver.ai/api/download?url=${encodeURIComponent(url)}`),
  );
}

describe("/api/download", () => {
  const realFetch = global.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn(async () => new Response("<svg/>", { headers: { "Content-Type": "image/svg+xml" } }));
    global.fetch = fetchMock;
  });

  afterEach(() => {
    global.fetch = realFetch;
  });

  it("serves SSW's own GitHub files", async () => {
    const response = await download(SSW_FILE);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Disposition")).toBe('attachment; filename="logo.svg"');
    expect(await response.text()).toBe("<svg/>");
  });

  it.each([
    "https://raw.githubusercontent.com/someone-else/repo/main/file.exe",
    "https://github.com/someone-else/repo/releases/download/v1/YakShaver-latest-Setup.exe",
    "https://objects.githubusercontent.com/anything",
    "https://example.com/SSWConsulting/file.svg",
    "http://raw.githubusercontent.com/SSWConsulting/SSW.Website/main/logo.svg",
  ])("refuses %s without fetching it", async (url) => {
    const response = await download(url);
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("names the file from its path, not a #fragment", async () => {
    const response = await download(`${SSW_FILE}#/YakShaver-latest-Setup.exe`);
    expect(response.headers.get("Content-Disposition")).toBe('attachment; filename="logo.svg"');
  });

  it("refuses files over the size limit", async () => {
    fetchMock.mockResolvedValue(
      new Response("x", { headers: { "Content-Length": String(26 * 1024 * 1024) } }),
    );
    const response = await download(SSW_FILE);
    expect(response.status).toBe(413);
  });
});
