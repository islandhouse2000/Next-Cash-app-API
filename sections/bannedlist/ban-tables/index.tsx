'use client';

import { AdminRegisterUsers, UserRegister } from '@/constants/data';
import { columns } from './columns';
import { useState, useEffect } from 'react';
import BanTablePage from './ban-table';

export default function BanTable() {

  const [data, setData] = useState<AdminRegisterUsers[]>([]);
  const [totalData, setTotalData] = useState<number>(0); // Store total items for pagination
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParam, setSearchParam] = useState("");
  const [selectCategory, setSelectCategory] = useState("tag");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const UserResponse = await fetch('/api/admin/getbannedlist'); // Your API for redeems
        const UserResult = await UserResponse.json();
        
        const usersResponse = await fetch('/api/admin/getbannedlist'); // Your API for users
        const usersResult = await usersResponse.json();
        
        const combinedData = UserResult.data.flatMap((registerEntry:any) => 
          registerEntry.register.map((register: UserRegister) => {
            const user = usersResult.data.find((user: AdminRegisterUsers) => user._id === register.id);          
            return { ...register, user }; 
          })
        );

        setData(combinedData);
        setTotalData(UserResult.totalCount); // Adjust if necessary
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredData = data.filter(item => {
    const param = searchParam.toLowerCase();
    switch (selectCategory) {
      case 'tag':
        return item.user?.tag?.toString().includes(param);
      case 'firstname':
        return item.user?.firstname?.toLowerCase().includes(param);
      case 'email':
        return item.user?.email?.toLowerCase().includes(param);
      case 'ip':
        return item.user?.ip?.toLowerCase().includes(param);
      case 'phonenumber':
        return item.phonenumber?.toLowerCase().includes(param);
      default:
        return true;
    }
  });

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or loading message if needed
  }

  return (
    <div className="space-y-4 ">
            <div className='flex justify-end'>
        <select
          onChange={(e) => setSelectCategory(e.target.value)}
          className='border focus:border-[#DAAC95] h-9 p-2 text-sm rounded-md outline-none mt-3 bg-background'
        >
          <option value="tag">Tag Number</option>
          <option value="firstname">Name</option>
          <option value="email">Username</option>
          <option value="ip">IP Address</option>
          <option value="phonenumber">Phone Number</option>
        </select>
        <input
          className='border focus:border-[#DAAC95] h-9 p-2 text-sm rounded-md outline-none mt-3 bg-background'
          placeholder='Search...'
          onChange={(e) => setSearchParam(e.target.value)}
        />
      </div>
      <BanTablePage columns={columns} data={filteredData} totalItems={filteredData.length} />
    </div>
  );
}