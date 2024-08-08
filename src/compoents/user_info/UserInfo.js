import React, { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './UserInfo.css';

const ageCategoryMap = {
  Infant: '乳幼児 0~2歳',
  Child: '子供 3歳~小6',
  Teen: '子供 中学生以上',
  Adult: '成人 18歳以上',
  Senior: '高齢者 65歳以上'
};

const genderMap = {
  male: '男性',
  female: '女性'
};

const imageMap = {
  Infant: {
    male: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5x8DUwBVjGR2IkVozOhVoe1zMnzIrcemz4s8xMsHR1gP8mV809urM_03Et8VWHxlGHXy1Vo2UD6x1z7SUVtVik0d0wCW37bbAIb1q7WOlKdyRiwpDkJiONBKEvgPdJFJFRTwGNMMeGUbW/s180-c/baby_role_towel_utsubuse.png',
    female: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5x8DUwBVjGR2IkVozOhVoe1zMnzIrcemz4s8xMsHR1gP8mV809urM_03Et8VWHxlGHXy1Vo2UD6x1z7SUVtVik0d0wCW37bbAIb1q7WOlKdyRiwpDkJiONBKEvgPdJFJFRTwGNMMeGUbW/s180-c/baby_role_towel_utsubuse.png'
  },
  Child: {
    male: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhFh6k52waXTQmtaBTVbyQcddvLchMCrcFbqUStFHvrp9HvJPdCLmKg_frF0y0v5MJ3AWFx1Lk7V_fHewPSg2sCBtIA48j31gX6-fZZuKho6L8zlLXlkDte9ViXxkOGRVaRnDWzQH8Ckmx9/s180-c/music_castanet_boy.png',
    female: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvq_f2poT0HX19_K7bepdsN_mXf6B0sdELeoQlbThKGTDyT2R3HhUHLOcInI6aW-NtL3225gzafqj6vpvFgsY63gVvVkqDKKqC6vKgHr1cV5LVjKXxF60c8FtJUtPaTdBahc7D2tVe89PK/s180-c/music_castanet_girl.png'
  },
  Teen: {
    male: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjmgASbUvCh3krYZviP7BM2DIy1iSucOSOKz6SVSvN3kujZtmRhcH52_4GRf-8bRH4LCRwyaK043G_sVryuFi0uLJHlKK1Tk962TOSs47w7tZOR_B9G3RaGmntu5mLlQWjUOrEVDnciD1o6/s180-c/gal_o_man.png',
    female: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7KrElxe8cLW8kvZND-nJD4i7UZa_w65SIkuLePcnQ7I4Fdw2z1VZqWnnKmtbH5VfZGY9xw9NyJRlL1Wfdhkmg6LZ0R-pQ3VZTZbD9ukaxP9-O6D-8snR4RnKahmgriiUHw1GwdHeCWohT/s180-c/drink_tapioka_tea_schoolgirl.png'
  },
  Adult: {
    male: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjnVH6ySvoZnUpbDf9MWKLOB36uG63mZ9VKxB1utN-Ulr9vZHWOHzcyOW7_a4KVf9BEWxcVXwJmARfui32tYTyuVMSartqHUXBE9-gcVncg2T6sYu6MU8z9o-ltqv3nRuLPM_J1eetcFi9d/s180-c/fashion_osyare_middle_man.png',
    female: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLoY9wPY1NL5uXoVQ41xmvL97KIRitfL0uN8rx7W7sLqAnfn9EohVd54swMLlC11ckDC0ggsnBja4xEtth4gDlIOBWdnX8hE0Vjh7bHa63AOj236lG_AYLJ7J6CnLxHxELFCzfq3yhjNjt/s180-c/fashion_osyare_middle_woman.png'
  },
  Senior: {
    male: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgkLLZMD1hewJltvx8Oc68SkpJjQPC7SXawXG53WUC7n6YlGIBeuo6hNoFueFWJ3APX44SrytQWOQ3IkYnztxpaOKc52em8kr7Xf3fwlLfZ_o2thdiBsQ9ySWEwK6sBMjIdr8lW2J93J_wG/s180-c/ireba_hazureru_man.png',
    female: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9-TJGv50o9a0J2LtSmlqkROmQ-qumuLX3ewkSRz-KAbfq_Tb_Lz_5sBJ6GohruQcNCgrnM6pDiozF18Xv58ObsX6YQDyDltdYYqewaNO14qe8fGqP6hepiRNWAHlSD0ijUUWIZS_rsydO/s180-c/koshi_magari_smile_obaasan.png'
  }
};

const UserInfo = () => {
  const [userId, setUserId] = useState(null);
  const [householdData, setHouseholdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigateフックを追加

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchHouseholdData = async () => {
      if (userId) {
        try {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setHouseholdData(docSnap.data().household);
          } else {
            setError("No such document!");
          }
        } catch (error) {
          setError("Error fetching household data: " + error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHouseholdData();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="family-info-container">
      <h1>Family Information</h1>
      {householdData ? (
        <div className="family-info">
          {Object.keys(householdData).map((key, index) => {
            const member = householdData[key];
            const ageCategory = member.ageCategory;
            const gender = member.gender;
            const imageUrl = imageMap[ageCategory][gender];

            return (
              <div key={key} className="family-member">
                <h3>{index + 1}人目の性別・年代</h3>
                <img src={imageUrl} alt={`${ageCategoryMap[ageCategory]} ${genderMap[gender]}`} className="animated-image" />
                <p><strong>世代:</strong> {ageCategoryMap[ageCategory]}</p>
                <p><strong>性別:</strong> {genderMap[gender]}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No household data available</p>
      )}
      <button className="user-button" onClick={() => navigate('/Login')}>ログイン設定</button> {/* リダイレクトボタンを追加 */}
    </div>
  );
};

export default UserInfo;
