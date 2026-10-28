export type BlogsRequest = {
    product?: string;
    startCursor?: string;
    keyword?: string;
    category?: string;
    locale?: string;
    loadAll?: boolean;
    /** Titles to leave out, e.g. the featured post shown above the list. */
    excludeTitles?: string[];
}
