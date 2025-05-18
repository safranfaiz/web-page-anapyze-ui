 
export interface AnalyzeResponse {
    htmlVersion: string;
    title: string;
    serviceTime: number;
    webPageExtractTime: number;
    headings: Heading[];
    urls: Url[];
    hasLogin: boolean;
    executedUrl: string;
    basePath: string;
    appExecuteTotalTime: number;
    sortHeading: any
}

export interface Url {
    url: string;
    accessible: boolean;
    type: string;
    status: number;
    urlExecutionTime: number;
}

export interface Heading {
    tag: string;
    text: string
}