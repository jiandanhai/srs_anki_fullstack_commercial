import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import ReviewCard from '../components/ReviewCard';
import useStore from '../store/useStore';

const API_BASE = 'http://localhost:4000';

const ReviewPage: React.FC = () => {
  const { token } = useStore();
  const [cards, setCards] = useState<any[]>([]);
  const [current, setCurrent] = useState<number>(0);

  const fetchDueCards = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cards/due/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        message.error(err.message || '获取待复习卡片失败');
        return;
      }
      const data = await res.json();
      setCards(Array.isArray(data) ? data : data.items || []);
      setCurrent(0);
    } catch (err) {
      message.error('网络或服务器错误');
    }
  };

  useEffect(() => {
    fetchDueCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReview = async (cardId: number, grade: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, grade }),
      });
      if (res.ok) {
        message.success('已提交复习结果');
        setCurrent((prev) => prev + 1);
      } else {
        const err = await res.json();
        message.error(err.message || '复习失败');
      }
    } catch (err) {
      message.error('网络或服务器错误');
    }
  };

  const currentCard = cards[current];

  return (
    <div>
      {currentCard ? (
        <ReviewCard card={currentCard} onReview={handleReview} />
      ) : (
        <p>今日复习已完成 🎉</p>
      )}
      {currentCard && (
        <div style={{ marginTop: 16 }}>
          {[0, 1, 2, 3, 4, 5].map((g) => (
            <Button key={g} onClick={() => handleReview(currentCard.id, g)} style={{ marginRight: 8 }}>
              {g}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
