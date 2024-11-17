'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useToast, toast } from '@/components/ui/use-toast';
import { AdminRegisterUsers } from '@/constants/data';

interface CellActionProps {
  data: AdminRegisterUsers;
}

export const CellAction: React.FC<CellActionProps> = ({ userId, redeemDate }: any) => {
  
  const { dismiss } = useToast();
  const [loading, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onConfirm= async () => {
    startTransition(async () => {
      try {
        const response = await deleteredeemCheck({
          id: userId,
          date: redeemDate,
        });
        
        if (response.error) {
          return;
        }
        
        setOpen(false);

        toast({
          title: 'Delete successful!',
          description: 'You have verified customer redeem',
        });

        location.reload();
        
      } catch (error) {
        toast({
          title: 'Delete Failed!',
          description: 'Your action has been failed. Please try again!',
        });
      }
    });
  };
  
  const deleteredeemCheck = async (userData: { id: string; date: any }) => {
    try {
      const response = await fetch("/api/admin/redeemdelete", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
            
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Delete failed' };
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or loading message if needed
  }

  const ok = () => {};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" handleClick={ok}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={()=>setOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};