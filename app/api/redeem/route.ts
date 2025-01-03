import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { isSameDay } from 'date-fns';

const timeZone = 'Pacific/Honolulu';

function getCurrentHSTUTCDate() {
  const nowUTC = new Date();
  const hstString = formatInTimeZone(nowUTC, timeZone, 'yyyy-MM-dd HH:mm:ss');
  const hstMomentAsUTC = zonedTimeToUtc(hstString, timeZone);
  return hstMomentAsUTC;
}

function hasAlreadyClaimedToday(lastClaimUTC: string) {
  if (!lastClaimUTC) return false;

  const nowUTC = new Date();
  const nowHST = utcToZonedTime(nowUTC, timeZone);
  const claimHST = utcToZonedTime(lastClaimUTC, timeZone);
  console.log('nowHST', nowHST, claimHST);
  const isSameDayDates = isSameDay(nowHST, claimHST);
  console.log('isSameDayDates', isSameDayDates);
  
  return isSameDayDates;  // returns true if both are in same HST date
}

export const POST = async (request: NextRequest) => {
  const { token, paymentoption, paymenttype, amount, id, btc, isChecked } =
    await request.json();
  await dbConnect();

  try {
    // Find the user by the token
    const user = await User.findOne({ token: token });

    if (user) {
      if (isChecked) {
        // Make a shallow copy before sorting, to avoid mutating the original array
        const sortedRedeem = [...user.redeem].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        // The first element in `sortedRedeem` is now the latest record
        const lastBonus = sortedRedeem.find((redeem: any) => redeem.dailyChecked);
        console.log('lastBonus record', lastBonus);
        
        if (lastBonus && hasAlreadyClaimedToday(lastBonus.isBonusInitializeTime)) {
          return NextResponse.json(
            { error: 'Bonus already used today' },
            { status: 400 }
          );
        }
      }

      const redeemObj: any = {
        amount: amount,
        btc: btc,
        paymentoption: paymentoption,
        paymenttype: paymenttype,
        id: id,
        dailyChecked: isChecked !== undefined ? isChecked : false
      };

      if (redeemObj.dailyChecked) {
        redeemObj.isBonusInitializeTime = getCurrentHSTUTCDate();
        console.log('isBonusInitializeTime', redeemObj.isBonusInitializeTime);
        
      }
      // Add new redeem information to the existing redeems array
      user.redeem.push(redeemObj);

      try {
        // Save the updated user document
        await user.save();

        return NextResponse.json(
          {
            ok: 'redeem added successfully'
          },
          { status: 200 }
        ); // Return success with a 200 status
      } catch (err: any) {
        return NextResponse.json(
          { error: 'Failed to save updated user' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 }); // Return not found
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
