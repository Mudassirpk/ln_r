import axios from "axios";

export const httpCommon = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: "http://172.25.18.33:3000/api",
});

export function extractHashtags(text: string) {
  // Regular expression to match hashtags
  const hashtagRegex = /#\w+/g;

  // Extract hashtags
  const hashtags = text.match(hashtagRegex) || []; // Return an empty array if no hashtags found

  // Remove hashtags from the original text
  const textWithoutHashtags = text.replace(hashtagRegex, "").trim();

  // Return the results
  return {
    textWithoutHashtags,
    hashtags: hashtags.map((tag) => tag.substring(1)), // Remove '#' from hashtags
  };
}
