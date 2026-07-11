import { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

export default function Toast() {
  const { toastMessage } = useContext(CartContext);

  if (!toastMessage) return null;

  return (
    <div className="toast">
      {toastMessage}
    </div>
  );
}