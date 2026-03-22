import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DebatesService {
  base = 'http://localhost:3001/api';
  constructor(private http: HttpClient) {}

  list() { return this.http.get<any[]>(`${this.base}/debates`); }
  get(id: string) { return this.http.get<any>(`${this.base}/debates/${id}`); }
  create(body: any) { return this.http.post<any>(`${this.base}/debates`, body); }
  close(id: string) { return this.http.post<any>(`${this.base}/debates/${id}/close`, {}); }

  listReplies(id: string) { return this.http.get<any[]>(`${this.base}/debates/${id}/replies`); }
  createReply(id: string, content: string) { return this.http.post<any>(`${this.base}/debates/${id}/replies`, { content }); }
  deleteReply(id: string, replyId: string) { return this.http.delete<void>(`${this.base}/debates/${id}/replies/${replyId}`); }
  updateReply(id: string, replyId: string, content: string) { return this.http.put<any>(`${this.base}/debates/${id}/replies/${replyId}`, { content }); }

  tally(id: string) { return this.http.get<any>(`${this.base}/debates/${id}/votes`); }
  vote(id: string, choice: 'up' | 'down') { return this.http.post<any>(`${this.base}/debates/${id}/votes`, { choice }); }

  generateSummary(id: string) { return this.http.post<any>(`${this.base}/debates/${id}/summary`, {}); }
  getSummary(id: string) { return this.http.get<any>(`${this.base}/debates/${id}/summary`); }

  deleteDebate(id: string) { return this.http.delete<void>(`${this.base}/debates/${id}`); }

  stream(id: string): EventSource {
    return new EventSource(`${this.base}/debates/${id}/stream`);
  }
}
