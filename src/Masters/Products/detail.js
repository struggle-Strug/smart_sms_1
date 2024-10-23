import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        ipcRenderer.send('get-product-detail', id);
        ipcRenderer.on('product-detail-data', (event, productData) => {
            setProduct(productData);
        });
        
        return () => {
            ipcRenderer.removeAllListeners('product-detail-data');
        };
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-full'>
            <div className='p-8'>
                <div className='text-2xl font-bold mb-8'>{product.name || '商品詳細'}</div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>商品名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.name || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>商品コード</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.code || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>カテゴリー</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.classification_primary || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>サブカテゴリー</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.classification_secondary || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>JANコード</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.jan_code || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>標準売価</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.standard_retail_price ? `${product.standard_retail_price}円` : ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>仕入単価</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.procurement_cost ? `${product.procurement_cost}円` : ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>メーカー名</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.manufacturer_name || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>規格・仕様</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.specification || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>単位</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.unit || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>原産国</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.country_of_origin || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>保管場所</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.storage_location || ''}</div>
                    </div>
                </div>
                <div className="flex bg-gray-100">
                    <div className="w-1/5">
                        <div className='p-4'>保管方法</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.storage_method || ''}</div>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="w-1/5">
                        <div className='p-4'>警告値</div>
                    </div>
                    <div className="w-4/5 py-1.5">
                        <div className='px-4 py-2.5'>{product.threshold ? `${product.threshold}個` : ''}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
