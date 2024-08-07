import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../Login/firebase";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const db = getFirestore();

const AuthComponent = () => {
  const [user, setUser] = useState(null); // ログイン状態

  // ログイン状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // ログインしている場合f
        setUser(authUser);
      } else {
        // ログアウトしている場合
        setUser(null);
      }
    });

    // アンマウント時に監視解除
    return () => {
      unsubscribe();
    };
  }, []);

  // ログイン
  const handleSignIn = async () => {
    try {
      // Googleログインポップアップを表示
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Firestoreでユーザーの存在を確認
      const userDocRef = doc(db, "users", user.email); // emailを使用
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // usersFamDataコレクションで家族情報を確認
        const userFamDocRef = doc(db, "usersFamData", user.uid);
        const userFamDoc = await getDoc(userFamDocRef);

        if (userFamDoc.exists() && userFamDoc.data().household) {
          // householdフィールドが存在する場合
          console.log('既存ユーザー (household情報あり)', user.email);
          window.location.href = '/home';
        } else {
          // householdフィールドが存在しない場合
          console.log('既存ユーザー (household情報なし)', user.email);
          window.location.href = '/user';
        }
      } else {
        // ドキュメントが存在しない場合（新規ユーザー）
        console.log('新規ユーザー', user.email);
        await setDoc(userDocRef, { email: user.email });
        window.location.href = '/user';
      }

    } catch (error) {
      // エラーハンドリング
      console.error('ログインエラー', error);
    }
  };

  // ログアウト
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/'; // ログアウト時に / にリダイレクト（必要なら）
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>ログインユーザー: {user.displayName}</p>
          <button onClick={handleSignOut}>ログアウト</button>
        </div>
      ) : (
        <div>
          <p>ログインしていません</p>
          <button onClick={handleSignIn}>ログイン</button>
        </div>
      )}
    </div>
  );
};

export default AuthComponent;
