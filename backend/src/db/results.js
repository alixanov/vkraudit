import { getDb } from './mongo.js';

const COLLECTION = 'results';

/**
 * Сохраняет результат проверки в MongoDB.
 */
export async function saveResult({ fileName, fileKey, fileUrl, mimeType, fileSize, result }) {
  const db  = getDb();
  const col = db.collection(COLLECTION);

  const doc = {
    fileName,
    fileKey,
    fileUrl,
    mimeType,
    fileSize,
    checkedAt:      new Date(),
    totalScore:     result.totalScore,
    percentage:     result.percentage,
    grade:          result.grade,
    status:         result.status,
    fontTotal:      result.fontTotal,
    volumeTotal:    result.volumeTotal,
    structureTotal: result.structureTotal,
    analysisTotal:  result.analysisTotal,
    details:        result.details,
    issues:         result.issues,
  };

  const { insertedId } = await col.insertOne(doc);
  return insertedId.toString();
}

/**
 * Возвращает последние N результатов.
 */
export async function getRecentResults(limit = 20) {
  const db  = getDb();
  return db.collection(COLLECTION)
    .find({})
    .sort({ checkedAt: -1 })
    .limit(limit)
    .toArray();
}
