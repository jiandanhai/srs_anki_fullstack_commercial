import React, { useState } from 'react';
import { Card, Button } from 'antd';

const ReviewCard: React.FC<{ card: any; onReview: (id: number, grade: number) => void }> = ({
  card,
  onReview,
}) => {
  const [showBack, setShowBack] = useState(false);

  return (
    <Card title="复习卡片" style={{ maxWidth: 600 }}>
      <p>{showBack ? card.answer : card.question}</p>
      {!showBack && (
        <Button type="dashed" onClick={() => setShowBack(true)} style={{ marginRight: 8 }}>
          显示答案
        </Button>
      )}
    </Card>
  );
};

export default ReviewCard;
