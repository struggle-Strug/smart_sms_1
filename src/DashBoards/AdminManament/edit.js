import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import CustomSelect from '../../Components/CustomSelect';
import SimpleSelect from '../../Components/Procurements/DashBoardCustomSelect';

const { ipcRenderer } = window.require('electron');

function AdminSettingsEdit() {
  const { id } = useParams();

  const accessLevelOptions = [
    {value:'0', label:'マスタ管理者'},
    {value:'1', label:'管理者'},
  ];

  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    id: id,
    user_name: '',
    access_level: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    ipcRenderer.send('edit-admin-setting', id);
    ipcRenderer.on('edit-admin-setting', (event, setAdminData) => {
      setAdmin({
        ...setAdminData,
        password: '',         // パスワードフィールドは空のままにする
        confirmPassword: '',   // 確認用パスワードも空のままにする
      });
      console.log(setAdminData);
    });
    return () => {
      ipcRenderer.removeAllListeners('edit-admin-setting');
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value});
  };

  const handleSubmit = () => {
    if (!admin.user_name) {
      alert('名前は必須項目です。');
      return;
    }
    if (!admin.password) {
      alert('パスワードは必須項目です。');
      return;
    }
    if (admin.password !== admin.confirmPassword) {
      alert('パスワードと確認用パスワードが一致しません。');
      return;
    }
    // 全ての条件がクリアされた場合にのみデータを送信
    ipcRenderer.send('save-admin-setting', admin);
    // フォームのリセット
    setAdmin({
      user_name: '',
      access_level: '',
      password: '',
      confirmPassword: '',
    });
    alert('ユーザー情報が変更されました。');
    navigate("/dashboards/admin-settings");
  };

  const [showPassword, setShowPassword] = useState(false);
  // パスワードの表示・非表示
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // 確認用パスワードの表示・非表示
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  console.log(admin);

  return (
    <div>
      <div className='pt-6 font-bold border-b w-full bg-white'>
        <div className='px-8 pb-6 text-2xl font-bold'>編集</div>
      </div>
      <div className='px-8 pt-6'>  
        {/* 名前 */}
        <div className="w-4/5 mb-4">
          <label className="block text-sm font-normal pb-1.5">名前 <span className="text-red-500">必須</span></label>
          <div className="relative w-2/3">
            <input 
              type='text'
              className='border rounded px-4 py-2.5 bg-white w-full' 
              placeholder='APIキーを入力' 
              name="user_name" 
              value={admin.user_name} 
              onChange={handleChange} 
            />
          </div>
        </div>
        {/* アクセスレベル */}
        <div className="w-4/5 mb-4">
          <label className="block text-sm font-normal pb-1.5">アクセスレベル </label>
          <div className="w-45 py-150">
          <SimpleSelect
            className='border rounded px-4 py-40 bg-white w-full h-12'
            placeholder=""
            options={accessLevelOptions}
            name="access_level"
            value={accessLevelOptions.find(option => option.value === admin.access_level)} // オブジェクト形式で渡す
            onChange={(selectedOption) => setAdmin({ ...admin, access_level: selectedOption.value })} // selectedOption全体を使用
            data={admin}
            setData={setAdmin}
          />

          </div>
        </div>
        {/* パスワード */}
        <div className="w-4/5 mb-4">
          <label className="block text-sm font-normal pb-1.5">変更後パスワード <span className="text-red-500">必須</span></label>
          <div className="relative w-2/3">
            <input 
              type={showPassword ? 'text' : 'password'} 
              className='border rounded px-4 py-2.5 bg-white w-full' 
              placeholder='APIキーを入力' 
              name="password" 
              value={admin.password} 
              onChange={handleChange} 
            />
            <button 
              onClick={togglePasswordVisibility} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-900 hover:text-gray-700"
            >
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.19469L2.46 0.242188L15 12.7822L14.0475 13.7422L11.7375 11.4322C10.875 11.7172 9.96 11.8672 9 11.8672C5.25 11.8672 2.0475 9.53469 0.75 6.24219C1.2675 4.92219 2.0925 3.75969 3.1425 2.83719L1.5 1.19469ZM9 3.99219C9.59674 3.99219 10.169 4.22924 10.591 4.6512C11.0129 5.07315 11.25 5.64545 11.25 6.24219C11.2504 6.49761 11.2073 6.75124 11.1225 6.99219L8.25 4.11969C8.49095 4.03492 8.74458 3.99181 9 3.99219ZM9 0.617188C12.75 0.617188 15.9525 2.94969 17.25 6.24219C16.6379 7.79709 15.5977 9.14672 14.25 10.1347L13.185 9.06219C14.2222 8.34472 15.0587 7.37398 15.615 6.24219C15.0087 5.00464 14.0673 3.96201 12.898 3.23282C11.7286 2.50362 10.3781 2.1171 9 2.11719C8.1825 2.11719 7.38 2.25219 6.63 2.49219L5.475 1.34469C6.555 0.879687 7.7475 0.617188 9 0.617188ZM2.385 6.24219C2.99133 7.47973 3.93268 8.52236 5.10205 9.25156C6.27142 9.98076 7.6219 10.3673 9 10.3672C9.5175 10.3672 10.0275 10.3147 10.5 10.2097L8.79 8.49219C8.26812 8.43625 7.78112 8.20334 7.40998 7.83221C7.03884 7.46107 6.80594 6.97407 6.75 6.45219L4.2 3.89469C3.4575 4.53219 2.835 5.32719 2.385 6.24219Z" fill="#666666"/>
              </svg>
            </button>
          </div>
        </div>
        {/* パスワード確認用 */}
        <div className="w-4/5 mb-4">
          <label className="block text-sm font-normal pb-1.5">変更後パスワード（確認用） <span className="text-red-500">必須</span></label>
          <div className="relative w-2/3">
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              className='border rounded px-4 py-2.5 bg-white w-full' 
              placeholder='APIキーを入力' 
              name="confirmPassword" 
              value={admin.confirmPassword} 
              onChange={handleChange} 
            />
            <button 
              onClick={toggleConfirmPasswordVisibility} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-900 hover:text-gray-700"
            >
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.19469L2.46 0.242188L15 12.7822L14.0475 13.7422L11.7375 11.4322C10.875 11.7172 9.96 11.8672 9 11.8672C5.25 11.8672 2.0475 9.53469 0.75 6.24219C1.2675 4.92219 2.0925 3.75969 3.1425 2.83719L1.5 1.19469ZM9 3.99219C9.59674 3.99219 10.169 4.22924 10.591 4.6512C11.0129 5.07315 11.25 5.64545 11.25 6.24219C11.2504 6.49761 11.2073 6.75124 11.1225 6.99219L8.25 4.11969C8.49095 4.03492 8.74458 3.99181 9 3.99219ZM9 0.617188C12.75 0.617188 15.9525 2.94969 17.25 6.24219C16.6379 7.79709 15.5977 9.14672 14.25 10.1347L13.185 9.06219C14.2222 8.34472 15.0587 7.37398 15.615 6.24219C15.0087 5.00464 14.0673 3.96201 12.898 3.23282C11.7286 2.50362 10.3781 2.1171 9 2.11719C8.1825 2.11719 7.38 2.25219 6.63 2.49219L5.475 1.34469C6.555 0.879687 7.7475 0.617188 9 0.617188ZM2.385 6.24219C2.99133 7.47973 3.93268 8.52236 5.10205 9.25156C6.27142 9.98076 7.6219 10.3673 9 10.3672C9.5175 10.3672 10.0275 10.3147 10.5 10.2097L8.79 8.49219C8.26812 8.43625 7.78112 8.20334 7.40998 7.83221C7.03884 7.46107 6.80594 6.97407 6.75 6.45219L4.2 3.89469C3.4575 4.53219 2.835 5.32719 2.385 6.24219Z" fill="#666666"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* フッターのボタン */}
      <div className='flex mt-8 fixed bottom-0 border-t w-full py-4 px-8 bg-white'>
        <div className='bg-blue-600 text-white rounded px-4 py-3 font-bold mr-6 cursor-pointer' onClick={handleSubmit}>更新
        </div>
        <Link to={`/dashboards/admin-settings`} className='border rounded px-4 py-3 font-bold cursor-pointer'>戻る</Link>
      </div>
    </div>
  );
}
export default AdminSettingsEdit;