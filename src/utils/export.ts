import type { Transaction } from '../types'

export function exportCSV(transactions: Transaction[]): void {
  const headers = ['Tarih', 'Tür', 'Kategori', 'Tutar', 'Not']
  const rows = transactions.map(t => [
    t.date,
    t.type === 'income' ? 'Gelir' : 'Gider',
    t.category,
    t.amount.toString().replace('.', ','),
    `"${(t.note || '').replace(/"/g, '""')}"`,
  ])
  const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n')
  download(csv, 'parapocket-veri.csv', 'text/csv;charset=utf-8')
}

export function exportJSON(transactions: Transaction[]): void {
  const json = JSON.stringify(transactions, null, 2)
  download(json, 'parapocket-veri.json', 'application/json')
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob(['\ufeff' + content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
