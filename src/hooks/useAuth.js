import { useState, useEffect } from 'react';

const INITIAL_USERS = [
  { id: 'admin', name: '관리자', company: 'SK브로드밴드', email: 'admin@skbroadband.com', phone: '010-0000-0000', status: 'APPROVED', role: 'ADMIN', createdAt: '2026-09-01' },
  { id: 'user_kim', name: '김철수', company: '제일기획', email: 'cheil@cheil.com', phone: '010-1234-5678', status: 'APPROVED', role: 'USER', createdAt: '2026-09-10' }
];

export function useAuth() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('btv_agent_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    localStorage.setItem('btv_agent_users', JSON.stringify(users));
  }, [users]);

  const login = (id, password) => {
    const user = users.find(u => u.id === id);
    if (!user) return { success: false, message: '존재하지 않는 계정입니다.' };
    if (user.role === 'ADMIN') {
      setCurrentUser(user);
      return { success: true, role: 'ADMIN' };
    }
    if (user.status === 'PENDING') return { success: false, message: '관리자 승인 대기 중입니다.' };
    if (user.status === 'REJECTED') return { success: false, message: '가입 요청이 거절되었습니다.' };

    setCurrentUser(user);
    return { success: true, role: 'USER' };
  };

  const signup = (form) => {
    if (users.find(u => u.id === form.id)) return { success: false, message: '이미 존재하는 아이디입니다.' };
    const newUser = { ...form, status: 'PENDING', role: 'USER', createdAt: new Date().toISOString().split('T')[0] };
    setUsers(prev => [...prev, newUser]);
    return { success: true };
  };

  const logout = () => setCurrentUser(null);

  const updateUserStatus = (userId, status) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  return { users, currentUser, login, signup, logout, updateUserStatus, deleteUser };
}