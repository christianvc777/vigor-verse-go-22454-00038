import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, MapPin, CreditCard, CheckCircle, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: number;
    image: string;
  };
}

const CheckoutFlow = ({ isOpen, onClose, product }: CheckoutFlowProps) => {
  const [step, setStep] = useState<'cart' | 'address' | 'payment' | 'success'>('cart');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState({
    fullName: '',
    address: '',
    city: 'Bogotá',
    phone: '',
  });
  const [payment, setPayment] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const { toast } = useToast();

  const subtotal = product.price * quantity;
  const shipping = subtotal * 0.1;
  const total = subtotal + shipping;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleContinueToAddress = () => {
    setStep('address');
  };

  const handleContinueToPayment = () => {
    if (!address.fullName || !address.address || !address.phone) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }
    setStep('payment');
  };

  const handleFinalizePurchase = () => {
    if (!payment.cardNumber || !payment.cardName || !payment.expiryDate || !payment.cvv) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los datos de pago',
        variant: 'destructive',
      });
      return;
    }
    setStep('success');
  };

  const handleClose = () => {
    setStep('cart');
    setQuantity(1);
    setAddress({ fullName: '', address: '', city: 'Bogotá', phone: '' });
    setPayment({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
    onClose();
  };

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getDeliveryTime = () => {
    return '2:00 PM - 6:00 PM';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="modal-content max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'cart' && <><ShoppingCart className="w-5 h-5" /> Tu Carrito</>}
            {step === 'address' && <><MapPin className="w-5 h-5" /> Dirección de Envío</>}
            {step === 'payment' && <><CreditCard className="w-5 h-5" /> Método de Pago</>}
            {step === 'success' && <><CheckCircle className="w-5 h-5 text-success" /> ¡Compra Exitosa!</>}
          </DialogTitle>
        </DialogHeader>

        {step === 'cart' && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex gap-4">
                <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary">
                    ${product.price.toLocaleString()} COP
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Cantidad</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="font-semibold w-8 text-center">{quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()} COP</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío (10%)</span>
                    <span>${shipping.toLocaleString()} COP</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${total.toLocaleString()} COP</span>
                  </div>
                </div>
              </div>
            </Card>

            <Button className="w-full fitness-button-primary" onClick={handleContinueToAddress}>
              Continuar a Envío
            </Button>
          </div>
        )}

        {step === 'address' && (
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Información de Envío</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input
                    id="fullName"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    placeholder="Calle 123 #45-67, Apto 101"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-muted">
              <h4 className="font-semibold mb-2">Resumen del Pedido</h4>
              <div className="space-y-1 text-sm">
                <p>{product.name} x {quantity}</p>
                <p className="font-bold text-lg text-primary">${total.toLocaleString()} COP</p>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('cart')} className="flex-1">
                Atrás
              </Button>
              <Button className="flex-1 fitness-button-primary" onClick={handleContinueToPayment}>
                Continuar a Pago
              </Button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Datos de Tarjeta</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                  <Input
                    id="cardNumber"
                    value={payment.cardNumber}
                    onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div>
                  <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                  <Input
                    id="cardName"
                    value={payment.cardName}
                    onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                    placeholder="JUAN PEREZ"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
                    <Input
                      id="expiryDate"
                      value={payment.expiryDate}
                      onChange={(e) => setPayment({ ...payment, expiryDate: e.target.value })}
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      value={payment.cvv}
                      onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-muted">
              <h4 className="font-semibold mb-2">Resumen del Pedido</h4>
              <div className="space-y-1 text-sm mb-3">
                <p>{product.name} x {quantity}</p>
                <p>Envío a: {address.city}</p>
                <p className="font-bold text-lg text-primary">${total.toLocaleString()} COP</p>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('address')} className="flex-1">
                Atrás
              </Button>
              <Button className="flex-1 fitness-button-primary" onClick={handleFinalizePurchase}>
                Finalizar Compra
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-6 text-center py-4">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2">¡Compra Exitosa!</h3>
              <p className="text-muted-foreground">Tu pedido ha sido procesado correctamente</p>
            </div>

            <Card className="p-4 text-left">
              <div className="flex items-start gap-3 mb-4">
                <Package className="w-5 h-5 text-primary mt-1" />
                <div className="flex-1">
                  <p className="font-semibold mb-1">{product.name}</p>
                  <p className="text-sm text-muted-foreground">Cantidad: {quantity}</p>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de entrega estimada:</span>
                </div>
                <p className="font-semibold">{getDeliveryDate()}</p>
                <p className="text-muted-foreground">{getDeliveryTime()}</p>

                <Separator className="my-2" />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dirección de envío:</span>
                </div>
                <p className="font-semibold">{address.address}</p>
                <p className="text-muted-foreground">{address.city}</p>

                <Separator className="my-2" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total Pagado:</span>
                  <span className="text-primary">${total.toLocaleString()} COP</span>
                </div>
              </div>
            </Card>

            <Button className="w-full fitness-button-primary" onClick={handleClose}>
              Volver al Feed
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutFlow;
