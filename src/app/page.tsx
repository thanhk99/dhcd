'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import styles from './page.module.css';
import { MeetingCard } from '@/components/home/MeetingCard';
import { ProxyCard } from '@/components/home/ProxyCard';
import { BottomNav } from '@/components/home/BottomNav';
import { meetingService } from '@/services/meetingService';
import { userService } from '@/services/userService';
import { logoutAction } from '@/actions/auth';
import { tokenManager } from '@/utils/tokenManager';
import { NotificationModal } from '@/components/home/NotificationModal';
import { NotificationItem } from '@/components/home/NotificationItem';
import type { Meeting } from '@/types/meeting';
import type { User } from '@/types/user';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const dummyNotifications = [
    {
      id: 1,
      type: 'important' as const,
      badge: 'QUAN TRỌNG',
      title: 'Khai mạc Đại hội Cổ đông Thường niên 2025',
      description: 'Đại hội chính thức bắt đầu lúc 08:30 ngày 23/01/2026. Quý cổ đông vui lòng ổn định chỗ ngồi và kiểm tra thiết bị biểu quyết.',
      timestamp: '10 phút trước'
    },
    {
      id: 2,
      type: 'guide' as const,
      badge: 'HƯỚNG DẪN',
      title: 'Hướng dẫn sử dụng hệ thống biểu quyết trực tuyến',
      description: 'Quý cổ đông có thể xem video và tài liệu hướng dẫn biểu quyết trực tuyến tại mục Tài liệu.',
      timestamp: '1 giờ trước'
    },
    {
      id: 3,
      type: 'info' as const,
      title: 'Công bố báo cáo tài chính năm 2024 (đã kiểm toán)',
      description: 'Báo cáo tài chính đã được tải lên hệ thống để quý cổ đông tra cứu.',
      timestamp: '2 giờ trước'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, meetingData] = await Promise.all([
          userService.getCurrentProfile(),
          meetingService.getOngoingMeeting()
        ]);
        setUser(profile);
        setMeeting(meetingData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date helper to HH:mm - DD/MM/YYYY
  const formatMeetingTime = (start: string) => {
    const startDate = new Date(start);
    const timeStr = startDate.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const dateStr = startDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return `${timeStr} - ${dateStr}`;
  };

  // Simple countdown helper
  const getCountdown = (start: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const diff = startDate.getTime() - now.getTime();

    if (diff <= 0) return 'Đang diễn ra';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `Còn ${days.toString().padStart(2, '0')} ngày ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutAction();
      tokenManager.clearAccessToken();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user?.fullName ? (
              <span className={styles.avatarText}>
                {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            ) : (
              <span className={styles.avatarText}>?</span>
            )}
          </div>
          <div>
            <p className={styles.greeting}>Xin chào,</p>
            <h1 className={styles.userName}>
              {loading ? 'Đang tải...' : (user?.fullName || 'Người dùng')}
            </h1>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionButton} title="Thông báo" onClick={() => setIsNotificationOpen(true)}>
            <Bell size={20} />
          </button>
          <button
            className={`${styles.actionButton} ${isDarkMode ? styles.dark : styles.light}`}
            title="Đổi giao diện"
            onClick={toggleTheme}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className={styles.logoutButton} onClick={handleLogout} title="Đăng xuất">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Current Meeting Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <div className={styles.dot}></div>
              <h2>CUỘC HỌP HIỆN TẠI</h2>
            </div>
            <a href="#" className={styles.link}>{meeting?.status === 'ONGOING' ? 'Đang diễn ra' : 'Sắp diễn ra'}</a>
          </div>

          {meeting ? (
            <MeetingCard
              image="/meeting-banner.png"
              title={meeting.title}
              time={formatMeetingTime(meeting.startTime)}
              location={meeting.location}
              address={meeting.location} // Using location for address as well based on API response
              countdown={getCountdown(meeting.startTime)}
              onVote={() => router.push('/election-detail')}
            />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
              Không có cuộc họp nào đang diễn ra
            </div>
          )}
        </section>

        {/* Proxy Information Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitlePlain}>Thông tin uỷ quyền</h2>
          </div>

          <ProxyCard
            sharesOwned={user?.sharesOwned || 0}
            totalShares={user?.totalShares || 0}
            receivedProxyShares={user?.receivedProxyShares || 0}
            delegatedShares={user?.delegatedShares || 0}
            delegationsReceived={user?.delegationsReceived || []}
            delegationsMade={user?.delegationsMade || []}
          />
        </section>
      </main>

      {/* Notification Modal */}
      <NotificationModal isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)}>
        {dummyNotifications.map(notification => (
          <NotificationItem
            key={notification.id}
            type={notification.type}
            badge={notification.badge}
            title={notification.title}
            description={notification.description}
            timestamp={notification.timestamp}
          />
        ))}
      </NotificationModal>

      {/* Bottom Navigation */}
      <BottomNav activeTab="home" />
    </div>
  );
}
