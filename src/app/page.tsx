'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import styles from './page.module.css';
import { MeetingCard } from '@/components/home/MeetingCard';
import { NotificationItem } from '@/components/home/NotificationItem';
import { NotificationModal } from '@/components/home/NotificationModal';
import { BottomNav } from '@/components/home/BottomNav';
import { meetingService } from '@/services/meetingService';
import { userService } from '@/services/userService';
import type { Meeting } from '@/types/meeting';
import type { User } from '@/types/user';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

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
        <button className={styles.notificationButton} onClick={() => setShowNotifications(true)}>
          <Bell size={24} />
        </button>
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

        {/* Notifications Section - Keeping inline list as a preview */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitlePlain}>Thông báo</h2>
            <button className={styles.link} onClick={() => setShowNotifications(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Xem tất cả</button>
          </div>

          <div className={styles.notificationList}>
            <NotificationItem
              type="important"
              badge="QUAN TRỌNG"
              title="Cập nhật đường dẫn tham dự họp"
              description="Bạn tổ chức đã cập nhật đường dẫn Zoom mới để đảm bảo chất lượng đường truyền tốt nhất..."
              timestamp="10:30 Hôm nay"
            />
            {/* Show only one item in preview to save space potentially, or keep all */}
            <NotificationItem
              type="guide"
              title="Hướng dẫn biểu quyết trực tuyến"
              description="Tài liệu hướng dẫn chi tiết các bước thực hiện biểu quyết và bầu cử trên hệ thống quốc gia..."
              timestamp="16:45 Hôm qua"
            />
          </div>
        </section>
      </main>

      {/* Notification Modal */}
      <NotificationModal isOpen={showNotifications} onClose={() => setShowNotifications(false)}>
        <NotificationItem
          type="important"
          badge="QUAN TRỌNG"
          title="Cập nhật đường dẫn tham dự họp"
          description="Bạn tổ chức đã cập nhật đường dẫn Zoom mới để đảm bảo chất lượng đường truyền tốt nhất..."
          timestamp="10:30 Hôm nay"
        />
        <NotificationItem
          type="guide"
          title="Hướng dẫn biểu quyết trực tuyến"
          description="Tài liệu hướng dẫn chi tiết các bước thực hiện biểu quyết và bầu cử trên hệ thống quốc gia..."
          timestamp="16:45 Hôm qua"
        />
        <NotificationItem
          type="info"
          title="Công bố danh sách ứng viên"
          description="Danh sách ứng viên bầu cử vào Hội đồng quản trị và Ban Kiểm soát nhiệm kỳ mới đã được công..."
          timestamp="09:00 22/04"
        />
      </NotificationModal>

      {/* Bottom Navigation */}
      <BottomNav activeTab="home" />
    </div>
  );
}
