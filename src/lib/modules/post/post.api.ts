import { getApi, postApi } from "@/lib/api/api";
import type {
  UserFeedPost,
  CommunityFeedPost,
  CompanyFeedPost,
} from "./post.interface";
import type { APIResponse } from "@/lib/types/api-response";

// USER FEED
export async function createUserFeedPostApi(body: {
  caption: string;
  media?: { url: string; type: string; order: number }[];
}): Promise<APIResponse<UserFeedPost>> {
  return postApi<UserFeedPost>("/post/user-feed", body);
}

export async function getSelfUserFeedPostsApi(params?: {
  limit?: number;
  offset?: number;
}): Promise<APIResponse<UserFeedPost[]>> {
  return getApi<UserFeedPost[]>("/post/self/user-feed", { params });
}

export async function getSelfUserFeedPostDetailApi(
  id: number
): Promise<APIResponse<UserFeedPost>> {
  return getApi<UserFeedPost>(`/post/self/user-feed/${id}`);
}

// COMMUNITY FEED
export async function createCommunityFeedPostApi(body: {
  communityId: number;
  caption: string;
  media?: { url: string; type: string; order: number }[];
}): Promise<APIResponse<CommunityFeedPost>> {
  return postApi<CommunityFeedPost>("/post/community-feed", body);
}

export async function getCommunityFeedPostsApi(
  communityId: number,
  params?: { limit?: number; offset?: number }
): Promise<APIResponse<CommunityFeedPost[]>> {
  return getApi<CommunityFeedPost[]>(
    `/post/community-feed?communityId=${communityId}`,
    { params }
  );
}

export async function getCommunityFeedPostDetailApi(
  communityId: number,
  id: number
): Promise<APIResponse<CommunityFeedPost>> {
  return getApi<CommunityFeedPost>(
    `/post/community-feed/${id}?communityId=${communityId}`
  );
}

// COMPANY FEED
export async function createCompanyFeedPostApi(body: {
  companyId: number;
  caption: string;
  media?: { url: string; type: string; order: number }[];
}): Promise<APIResponse<CompanyFeedPost>> {
  return postApi<CompanyFeedPost>("/post/company-feed", body);
}

export async function getCompanyFeedPostsApi(
  companyId: number,
  params?: { limit?: number; offset?: number }
): Promise<APIResponse<CompanyFeedPost[]>> {
  return getApi<CompanyFeedPost[]>(
    `/post/company-feed?companyId=${companyId}`,
    { params }
  );
}

export async function getCompanyFeedPostDetailApi(
  companyId: number,
  id: number
): Promise<APIResponse<CompanyFeedPost>> {
  return getApi<CompanyFeedPost>(
    `/post/company-feed/${id}?companyId=${companyId}`
  );
}
