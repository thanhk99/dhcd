'use client';

import React from 'react';
import { Shield, ArrowRightLeft, UserCheck } from 'lucide-react';
import styles from './ProxyCard.module.css';

import { Delegation } from '@/types/user';

interface ProxyCardProps {
    totalShares: number;
    receivedProxyShares: number;
    delegatedShares: number;
    delegationsReceived: Delegation[];
    delegationsMade: Delegation[];
}

export const ProxyCard: React.FC<ProxyCardProps> = ({
    totalShares,
    receivedProxyShares,
    delegatedShares,
    delegationsReceived = [],
    delegationsMade = []
}) => {
    const selfVotingRights = Math.max(0, totalShares - delegatedShares);
    const totalVotingRights = selfVotingRights + receivedProxyShares;

    return (
        <div className={styles.container}>
            <div className={styles.mainStat}>
                <div className={styles.iconWrapper}>
                    <Shield size={24} className={styles.icon} />
                </div>
                <div className={styles.info}>
                    <span className={styles.label}>TỔNG CỔ PHẦN SỞ HỮU</span>
                    <span className={styles.value}>{(totalShares).toLocaleString('vi-VN')} CP</span>
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.subStat}>
                    <div className={styles.subIconWrapper} style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
                        <UserCheck size={18} style={{ color: '#4CAF50' }} />
                    </div>
                    <div className={styles.subInfo}>
                        <span className={styles.subLabel}>Bản thân</span>
                        <span className={styles.subValue}>
                            {Math.max(0, totalShares - delegatedShares).toLocaleString('vi-VN')}
                        </span>
                    </div>
                </div>

                <div className={styles.subStat}>
                    <div className={styles.subIconWrapper} style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                        <ArrowRightLeft size={18} style={{ color: '#2196F3' }} />
                    </div>
                    <div className={styles.subInfo}>
                        <span className={styles.subLabel}>Nhận uỷ quyền</span>
                        <span className={styles.subValue}>{receivedProxyShares.toLocaleString('vi-VN')}</span>
                    </div>
                </div>
            </div>

            {/* List of Delegators */}
            {/* List of Delegations (Made & Received) */}
            {(delegationsReceived.length > 0 || delegationsMade.length > 0) && (
                <div className={styles.delegationList}>
                    {/* Received Delegations */}
                    {delegationsReceived.length > 0 && (
                        <>
                            <h4 className={styles.listTitle}>Người uỷ quyền cho tôi ({delegationsReceived.length})</h4>
                            <div className={styles.listContent}>
                                {delegationsReceived.map((delegation) => (
                                    <div key={delegation.id} className={styles.delegationItem}>
                                        <div className={styles.delegatorInfo}>
                                            <span className={styles.delegatorName}>{delegation.delegatorName}</span>
                                            <span className={styles.delegationDate}>
                                                {new Date(delegation.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <span className={styles.delegatedAmount}>
                                            +{delegation.sharesDelegated.toLocaleString('vi-VN')} CP
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Made Delegations */}
                    {delegationsMade.length > 0 && (
                        <>
                            <h4 className={styles.listTitle} style={{ marginTop: delegationsReceived.length > 0 ? 16 : 0 }}>
                                Tôi uỷ quyền cho ({delegationsMade.length})
                            </h4>
                            <div className={styles.listContent}>
                                {delegationsMade.map((delegation) => (
                                    <div key={delegation.id} className={styles.delegationItem}>
                                        <div className={styles.delegatorInfo}>
                                            <span className={styles.delegatorName}>{delegation.proxyName}</span>
                                            <span className={styles.delegationDate}>
                                                {new Date(delegation.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <span className={styles.delegatedAmount} style={{ color: '#FF9800' }}>
                                            -{delegation.sharesDelegated.toLocaleString('vi-VN')} CP
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className={styles.footer}>
                <div className={styles.totalRights}>
                    <span className={styles.footerLabel}>TỔNG QUYỀN BIỂU QUYẾT</span>
                    <span className={styles.footerValue}>{totalVotingRights.toLocaleString('vi-VN')} CP</span>
                </div>
            </div>
        </div>
    );
};
