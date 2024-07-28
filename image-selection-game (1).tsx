import React, { useState } from 'react';
import { Check } from 'lucide-react';

const ImageSelectionGame = () => {
  const [stage, setStage] = useState(1);
  const [selectedImagesStage1, setSelectedImagesStage1] = useState([]);
  const [selectedImagesStage2, setSelectedImagesStage2] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [otherPlace, setOtherPlace] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const imageUrl = "/api/placeholder/400/400";

  const images = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    src: imageUrl
  }));

  const toggleImageSelection = (id) => {
    if (isComplete) return;
    if (stage === 1) {
      setSelectedImagesStage1(prev => 
        prev.includes(id) ? prev.filter(imgId => imgId !== id) : [...prev, id]
      );
    } else if (stage === 2) {
      setSelectedImagesStage2(prev => 
        prev.includes(id) ? prev.filter(imgId => imgId !== id) : [...prev, id]
      );
    } else if (stage === 3) {
      setSelectedPlace(id === selectedPlace ? null : id);
    }
  };

  const handleComplete = () => {
    if (stage < 4) {
      setStage(stage + 1);
    } else {
      setIsComplete(true);
    }
  };

  const getStageTitle = () => {
    switch (stage) {
      case 1: return "בחר את התמונות שאתה הכי פחות אוהב";
      case 2: return "בחר את התמונות שאתה הכי אוהב";
      case 3: return "בחר את המקום שהכי היית רוצה להיות בו";
      case 4: return "סיכום הבחירות שלך";
      default: return "";
    }
  };

  const getSelectedImages = () => {
    if (stage === 1) return selectedImagesStage1;
    if (stage === 2) return selectedImagesStage2;
    return selectedPlace !== null ? [selectedPlace] : [];
  };

  const renderImage = (image, isSelected, size = 'w-24 h-24') => (
    <div 
      key={image.id} 
      className={`relative rounded-lg overflow-hidden ${size} ${
        isSelected ? 'border-2 border-black' : 'border border-gray-300'
      }`}
    >
      <img 
        src={image.src} 
        alt={`תמונה ${image.id + 1}`} 
        className="w-full h-full object-cover"
        style={{
          objectPosition: `${(image.id % 6) * 20}% ${Math.floor(image.id / 6) * 33.33}%`
        }}
      />
      {isSelected && (
        <div className="absolute top-1 left-1 bg-white rounded-full p-0.5">
          <Check size={16} color="black" />
        </div>
      )}
    </div>
  );

  const renderSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">תמונות שהכי פחות אהבת</h3>
        <div className="grid grid-cols-3 gap-1">
          {images.map(image => renderImage(image, selectedImagesStage1.includes(image.id), 'w-16 h-16'))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">תמונות שהכי אהבת</h3>
        <div className="grid grid-cols-3 gap-1">
          {images.map(image => renderImage(image, selectedImagesStage2.includes(image.id), 'w-16 h-16'))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">המקום שהיית רוצה להיות בו</h3>
        {selectedPlace !== null ? (
          <div className="grid grid-cols-3 gap-1">
            {images.map(image => renderImage(image, image.id === selectedPlace, 'w-16 h-16'))}
          </div>
        ) : (
          <p>מקום אחר: {otherPlace}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">{getStageTitle()}</h1>
      {stage < 4 ? (
        <>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="relative cursor-pointer"
                onClick={() => toggleImageSelection(image.id)}
              >
                {renderImage(image, getSelectedImages().includes(image.id))}
              </div>
            ))}
          </div>
          {stage === 3 && (
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedPlace === null}
                  onChange={() => setSelectedPlace(null)}
                  className="mr-2"
                />
                אחר
              </label>
              {selectedPlace === null && (
                <input
                  type="text"
                  value={otherPlace}
                  onChange={(e) => setOtherPlace(e.target.value)}
                  placeholder="הזן מקום אחר"
                  className="mt-2 p-2 border rounded"
                />
              )}
            </div>
          )}
          <div className="text-center mb-4">
            <p>תמונות שנבחרו: {getSelectedImages().length}</p>
          </div>
        </>
      ) : (
        renderSummary()
      )}
      <button
        onClick={handleComplete}
        disabled={isComplete || (stage === 3 && selectedPlace === null && otherPlace === '')}
        className={`px-6 py-2 rounded-full text-white font-semibold
          ${isComplete || (stage === 3 && selectedPlace === null && otherPlace === '')
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {isComplete ? 'הושלם' : stage === 4 ? 'סיום המשחק' : 'המשך לשלב הבא'}
      </button>
    </div>
  );
};

export default ImageSelectionGame;
