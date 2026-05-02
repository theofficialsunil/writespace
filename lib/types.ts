export type UserRole = "reader" | "publisher";

export interface Blog {
    id : Number;
    title : string;
    slug : string;
    description: string;
    content : string;
    author: string;
    publishDate : string;
    thumbnail : string;
    tags : string[];
    category : string;
    likes? : number;
    readTime? : string;
    status? : "published"| "drafts";
}