import React, { useContext } from 'react';
import EhsaanDrawPicture from '../../assets/EhsaanDrawPicture.png';
import { Trash2 } from 'lucide-react';
import { ThemeContext } from '../../themeContext';
import './index.css'

interface SceneData {
  id: string;
  userName1: string;
  scenes1: string[];
  createdAt?: { seconds: number; nanoseconds: number };
}

interface CardListProps {
  values: SceneData[];
  handleDelete: (id: string) => void;
  handleEdit: (id: string, userName: string, scenes: string[]) => void;
}

const CardList: React.FC<CardListProps> = ({ values, handleDelete, handleEdit }) => {
  const { theme } = useContext(ThemeContext);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    const { seconds, nanoseconds } = timestamp;
    const date = new Date(seconds * 1000 + nanoseconds / 1000000);
    return date.toLocaleDateString();
  };
  
  return (
    <>
      <div className="card-grid">
        {values?.map((item) => (
          <div
            key={item.id}
            className={`card ${theme === 'dark' ? 'dark-card' : 'light-card'}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
          >
            <div className="card-content">
              <button
                onClick={() => handleEdit(item?.id, item?.userName1, item?.scenes1)}
                className="card-image-button"
              >
                <div className="image-wrapper">
                  <img
                    src={EhsaanDrawPicture}
                    className="card-image"
                    alt="No pict"
                  />
                </div>
              </button>

              <div className="card-footer">
                <p className="card-username">
                  {item?.userName1}
                </p>

                <button
                  onClick={() => handleDelete(item?.id)}
                  className="delete-button"
                >
                  <Trash2 color={theme === "dark" ? "#E3E3E8" : "#000000"} />
                </button>
              </div>

              <p className="card-timestamp">
                <strong>Created At:</strong> {formatTimestamp(item?.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
      {values?.length === 0 && (
        <div className="empty-message">
          <p className="empty-message-text flex items-center justify-center">
            No sketch created so far.
          </p>
        </div>
      )}
    </>
  );
};

export default CardList;
