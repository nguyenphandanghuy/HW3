import React, { useState, useMemo } from 'react';
import { MOCK_EMPLOYEES } from '../data/mockEmployees';
import { Employee } from '../types/employee';

export const DataGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Employee>('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Lọc dữ liệu theo Search
  const filteredData = useMemo(() => {
    return MOCK_EMPLOYEES.filter((emp) =>
      Object.values(emp).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  // Sắp xếp dữ liệu
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortAsc ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortAsc]);

  // Phân trang (5 item / trang)
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage]);

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'sans-serif', padding: 20 }}>
      {/* Skip Link cho chuẩn WCAG 2.2 AA */}
      <a href="#main-content" style={{ position: 'absolute', left: -9999 }}>
        Skip to main content
      </a>

      <h2>Enterprise Data Grid</h2>
      <p style={{ color: '#666' }}>Accessible data management interface</p>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20, backgroundColor: '#fff' }} id="main-content">
        <h3>Employee Directory</h3>

        {/* Thước đo số lượng kết quả */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ padding: '8px 12px', width: 300, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <button onClick={() => setSearchTerm('')} style={{ padding: '8px 12px', cursor: 'pointer' }}>
            Clear search
          </button>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              {(['id', 'name', 'department', 'role', 'status'] as Array<keyof Employee>).map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  style={{ padding: 12, cursor: 'pointer', textTransform: 'capitalize' }}
                >
                  {col} {sortField === col ? (sortAsc ? '▲' : '▼') : '↕'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((emp) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12 }}>{emp.id}</td>
                <td style={{ padding: 12, fontWeight: 'bold' }}>{emp.name}</td>
                <td style={{ padding: 12 }}>{emp.department}</td>
                <td style={{ padding: 12 }}>{emp.role}</td>
                <td style={{ padding: 12 }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 'bold',
                      backgroundColor:
                        emp.status === 'Active'
                          ? '#d1fae5'
                          : emp.status === 'On Leave'
                          ? '#fef3c7'
                          : '#fee2e2',
                      color:
                        emp.status === 'Active'
                          ? '#065f46'
                          : emp.status === 'On Leave'
                          ? '#92400e'
                          : '#991b1b',
                    }}
                  >
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Nút phân trang */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 15, marginTop: 20 }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            style={{ padding: '6px 12px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            style={{ padding: '6px 12px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};