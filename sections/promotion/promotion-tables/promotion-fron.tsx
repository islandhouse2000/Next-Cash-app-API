'use client';
import Image from 'next/image';
import { GameLink } from './game-link';
import { useRouter } from 'next/navigation';
import TagId from '@/components/ui/tagId';
import VIPTagId from '@/components/ui/VipTagId';
import { Roles } from '@/constants/roles';

export default function PromotionPage({ tagData }: any) {
  const router = useRouter();

  const register = () => {
    router.push('/mypage/register');
  };

  const recharge = () => {
    router.push('/mypage/deposit');
  };

  const redeem = () => {
    router.push('/mypage/withdrawal');
  };

  const ourUs = () => {
    router.push('/mypage/chat');
  };

  const facebook = () => {
    router.push(
      'https://www.facebook.com/profile.php?id=61564819906157&mibextid=ZbWKwL'
    );
  };

  const instagram = () => {
    router.push('https://www.instagram.com/islandhouse2000/');
  };
  return (
    <>
      <div className="w-full">
        {tagData?.role === Roles.vip_user ? <VIPTagId tagId={tagData?.tag} /> : <TagId tagId={tagData?.tag} />}
      </div>
      {/* <div className="grid justify-items-center">
        <Image src="/promo/promo1.png" width={1000} height={1000} alt="ad" />
      </div> */}
      {/* <div className="grid justify-items-center">
        <Image src="/promo/promo2.png" width={1000} height={1000} alt="ad" />
      </div> */}
      <div className="grid w-full grid-cols-1 place-items-center">
        <div className="grid grid-cols-2 justify-items-center gap-2 lg:flex lg:justify-center">
          <Image
            src="/my-page/button_1.png"
            width={300}
            height={5}
            className="hover:cursor-pointer hover:opacity-80 pt-[3px]"
            onClick={register}
            alt="register"
          ></Image>
          <Image
            src="/my-page/button_2.png"
            width={300}
            height={5}
            className="mt-1 hover:cursor-pointer hover:opacity-80 lg:ml-2 lg:mt-0"
            onClick={recharge}
            alt="recharge"
          ></Image>
          <Image
            src="/my-page/button_3.png"
            width={300}
            height={5}
            className="mt-1 hover:cursor-pointer hover:opacity-80 lg:ml-2 lg:mt-0"
            onClick={redeem}
            alt="redeem"
          ></Image>
          <Image
            src="/my-page/button_4.png"
            width={300}
            height={5}
            className="mt-1 hover:cursor-pointer hover:opacity-80 lg:ml-2 lg:mt-0"
            alt="our us"
            onClick={ourUs}
          ></Image>
        </div>
      </div>
      <div className="w-full">
        <p className="text-md mt-5 text-center font-bold">
          Welcome to ISLAND HOUSE!
        </p>
        <p className="text-md text-center font-bold">
          Click image to download link
        </p>
      </div>
      <GameLink />
    </>
  );
}
