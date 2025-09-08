
import React from 'react';

interface PlaceholderViewProps {
  featureName: string;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ featureName }) => {
  return (
    <div className="text-center p-8 bg-gray-700 rounded-lg">
      <h3 className="text-2xl font-bold text-purple-400 mb-2">{featureName}</h3>
      <p className="text-gray-400">Chức năng này đang được phát triển. Vui lòng quay lại sau, Đạo Hữu!</p>
       <div className="mt-6">
            <img src="https://picsum.photos/400/200" alt="Đang xây dựng" className="mx-auto rounded-lg shadow-lg"/>
       </div>
    </div>
  );
};

export default PlaceholderView;