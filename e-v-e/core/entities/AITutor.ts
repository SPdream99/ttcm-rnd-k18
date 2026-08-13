export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  codeSnippet?: string;
  suggestedFollowups?: string[];
}

export interface AITutorSubject {
  id: string;
  name: string;
  iconName: string;
}
