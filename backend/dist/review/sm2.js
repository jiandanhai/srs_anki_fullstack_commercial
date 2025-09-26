"use strict";
/**
 * SM-2 算法实现 (SuperMemo-2)
 *
 * 输入：
 *  - grade: 用户评分 0-5
 *  - card: 当前卡片的 ef / repetition / interval
 *
 * 输出：
 *  - 更新后的 ef、repetition、interval、nextReviewAt
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySM2 = applySM2;
function applySM2(card, grade) {
    let { ef, repetition, interval } = card;
    if (grade < 3) {
        // 失败：重置
        repetition = 0;
        interval = 1;
    }
    else {
        if (repetition === 0) {
            interval = 1;
        }
        else if (repetition === 1) {
            interval = 6;
        }
        else {
            interval = Math.round(interval * ef);
        }
        repetition += 1;
        // 更新 EF
        ef = ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
        if (ef < 1.3)
            ef = 1.3; // EF 下限
    }
    card.ef = parseFloat(ef.toFixed(2));
    card.repetition = repetition;
    card.interval = interval;
    card.nextReviewAt = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);
    return card;
}
