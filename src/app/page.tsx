'use client';

import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import styles from './page.module.css';
import { MeetingCard } from '@/components/home/MeetingCard';
import { NotificationItem } from '@/components/home/NotificationItem';
import { BottomNav } from '@/components/home/BottomNav';
import { userService } from '@/services/userService';
import type { User } from '@/types/user';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await userService.getCurrentProfile();
        setUser(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);
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
        <button className={styles.notificationButton}>
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
            <a href="#" className={styles.link}>Đang diễn ra</a>
          </div>

          <MeetingCard
            title="Đại hội đồng cổ đông thường niên 2024"
            time="08:00 - 25/04/2024"
            location="Khách sạn Melia Hanoi"
            address="44B Lý Thường Kiệt, Hoàn Kiếm, Hà Nội"
            countdown="Còn 02 ngày 14:30:05"
            onVote={() => console.log('Vote clicked')}
          />
        </section>

        {/* Notifications Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitlePlain}>Thông báo</h2>
            <a href="#" className={styles.link}>Xem tất cả</a>
          </div>

          <div className={styles.notificationList}>
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
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="home" />
    </div>
  );
}
