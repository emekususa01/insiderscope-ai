
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import axios from 'axios';

export default function Home() {
  const [filings, setFilings] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFilings();
  }, []);

  const fetchFilings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/sec-filings');
      setFilings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFilings = filings.filter(filing => {
    if (!search && filter === 'all') return true;
    const matchesSearch = filing.company.toLowerCase().includes(search.toLowerCase()) || filing.insider.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || filing.transaction_type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📄 InsiderScope AI</h1>
        <button
          onClick={() =>
            document.documentElement.classList.toggle('dark')
          }
          className="border px-3 py-1 rounded"
        >
          🌓 Toggle Theme
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by company or insider..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded p-2 dark:bg-gray-800"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <Button onClick={fetchFilings}>🔄 Refresh</Button>
      </div>

      {loading ? (
        <p className="text-center text-lg">⏳ Loading filings...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
          {filteredFilings.map((filing, index) => (
            <Card key={index} className="shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{filing.company}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {filing.insider} ({filing.role})
                    </p>
                    <p className="text-sm">{new Date(filing.date).toLocaleDateString()}</p>
                    <p className="mt-1">
                      💼 {filing.transaction_type.toUpperCase()} – 💰 ${filing.amount.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={filing.transaction_type === 'buy' ? 'success' : 'destructive'}>
                    {filing.transaction_type.toUpperCase()}
                  </Badge>
                </div>
                {filing.summary && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                    “{filing.summary}”
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
