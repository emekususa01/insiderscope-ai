
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

  useEffect(() => {
    fetchFilings();
  }, []);

  const fetchFilings = async () => {
    try {
      const res = await axios.get('/api/sec-filings');
      setFilings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFilings = filings.filter(filing => {
    if (!search && filter === 'all') return true;
    const matchesSearch = filing.company.toLowerCase().includes(search.toLowerCase()) || filing.insider.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || filing.transaction_type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6">📄 InsiderScope AI</h1>
      <div className="flex gap-4 mb-4">
        <Input placeholder="Search by company or insider..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="border rounded p-2" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <Button onClick={fetchFilings}>🔄 Refresh</Button>
      </div>
      <div className="grid gap-4">
        {filteredFilings.map((filing, index) => (
          <Card key={index} className="shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{filing.company} – {filing.insider}</p>
                  <p className="text-sm text-gray-500">{filing.role} – {new Date(filing.date).toLocaleDateString()}</p>
                  <p className="mt-1">💼 {filing.transaction_type.toUpperCase()} – 💰 ${filing.amount.toLocaleString()}</p>
                </div>
                <Badge variant={filing.transaction_type === 'buy' ? 'success' : 'destructive'}>
                  {filing.transaction_type.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
