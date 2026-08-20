export type BlogsRequest = {
    product?: string;
    startCursor?: string;
    keyword?: string;
    category?: string;
    locale?: string;
    loadAll?: boolean;
}
