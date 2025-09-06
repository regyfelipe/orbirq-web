export default class Invite {
  constructor(row) {
    this.id = row.id;
    this.token = row.token;
    this.professorId = row.professor_id;
    this.tipo = row.tipo; // 'permanente' | 'unico'
    this.status = row.status; // 'pending' | 'accepted' | 'expired'
    this.expiresAt = row.expires_at;
    this.createdAt = row.created_at;
  }
}