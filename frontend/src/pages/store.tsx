import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Store = () => {
  // Mock data for products
  const [products] = useState([
    { id: 1, name: 'Reusable Water Bottle', description: 'Eco-friendly water bottle.', points: 200 },
    { id: 2, name: 'Tote Bag', description: 'Stylish and reusable tote bag.', points: 150 },
    { id: 3, name: 'Notebook', description: 'Recycled paper notebook.', points: 100 },
    { id: 4, name: 'Gift Card', description: 'Gift card worth $10.', points: 500 },
    { id: 5, name: 'Plant Kit', description: 'Grow your own plant kit.', points: 300 },
  ]);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Simulate user authentication status
  const isLoggedIn = false; // Change this to `true` to simulate a logged-in user

  const handleRedeem = (productId: number) => {
    if (!isLoggedIn) {
      toast({
        title: 'Login Required',
        description: 'You need to log in to redeem this product.',
        variant: 'destructive',
      });
      return;
    }

    // Navigate to the purchase page
    navigate('/purchase', { state: { productId } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-16">
        <div className="container">
          <h1 className="text-3xl font-bold text-center mb-8">Store</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">Points Required: {product.points}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={product.points > 1000 /* Example condition */}
                    onClick={() => handleRedeem(product.id)}
                  >
                    Redeem
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Store;