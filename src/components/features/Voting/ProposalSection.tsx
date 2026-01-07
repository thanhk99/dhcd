import React, { useState } from 'react';
import { FileText, Check } from 'lucide-react';
import styles from './ProposalSection.module.css';
import { Resolution, VotingOption } from '@/types/meeting';

interface ProposalSectionProps {
    proposals: Resolution[];
    initialVotes?: Record<string, string>;
    onChange?: (votes: Record<string, string>) => void;
}

export const ProposalSection: React.FC<ProposalSectionProps> = ({ proposals, initialVotes = {}, onChange }) => {
    const [votes, setVotes] = React.useState<Record<string, string>>(initialVotes);

    React.useEffect(() => {
        if (Object.keys(initialVotes).length > 0) {
            setVotes(initialVotes);
        }
    }, [initialVotes]);

    const handleVote = (proposalId: string, optionId: string) => {
        const newVotes = { ...votes, [proposalId]: optionId };
        setVotes(newVotes);
        if (onChange) {
            onChange(newVotes);
        }
    };

    return (
        <div className={styles.section}>
            {proposals.map((proposal) => (
                <div key={proposal.id} className={`${styles.proposalCard} ${votes[proposal.id] ? styles.proposalCardActive : ''}`}>
                    <div className={styles.header}>
                        <div className={styles.info}>
                            <span className={styles.tag}>{proposal.resolutionCode || 'Tờ trình'}</span>
                            <h3 className={styles.proposalTitle}>{proposal.title}</h3>
                        </div>
                        <FileText className={styles.docIcon} size={24} />
                    </div>

                    <div className={styles.options}>
                        {proposal.votingOptions.map((option) => (
                            <div
                                key={option.id}
                                className={`${styles.option} ${votes[proposal.id] === option.id ? styles.optionSelected : ''}`}
                                onClick={() => handleVote(proposal.id, option.id)}
                            >
                                <div className={`${styles.radio} ${votes[proposal.id] === option.id ? styles.radioSelected : ''}`}>
                                    {votes[proposal.id] === option.id && <Check className={styles.checkIcon} size={12} />}
                                </div>
                                <span className={styles.optionText}>{option.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
