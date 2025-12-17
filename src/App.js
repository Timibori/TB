import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Table, Button, Row, Col, Carousel, Form, Card, Toast, ToastContainer } from 'react-bootstrap';
import { galleryImages } from './data'; // We keep galleryImages, but remove menuItems import
import './App.css';

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showToast, setShowToast] = useState(false);

  // 1. FETCH MENU FROM BACKEND
  useEffect(() => {
    axios.get('https://tastybites-backend-ea3v.onrender.com')
      .then(response => {
        // Map MongoDB '_id' to 'id' for compatibility with your code
        const dataWithIds = response.data.map(item => ({
            ...item,
            id: item._id 
        }));
        setMenuItems(dataWithIds);
      })
      .catch(error => console.error('Error fetching menu:', error));
  }, []);

  // 2. ADD TO CART
  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    setShowToast(true); // <--- THIS IS THE NEW LINE
  };

  // 3. REMOVE FROM CART
  const removeFromCart = (id) => {
    const existingItem = cart.find((item) => item.id === id);
    if (existingItem.quantity > 1) {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item)));
    } else {
      setCart(cart.filter((item) => item.id !== id));
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  // 4. HANDLE CHECKOUT (SEND ORDER TO BACKEND)
  const handleCheckout = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const orderData = {
      customerDetails: {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      },
      items: cart,
      totalAmount: cartTotal
    };

    try {
      await axios.post('https://tastybites-backend-ea3v.onrender.com', orderData);
      alert('Order placed successfully!');
      setCart([]); // Clear the cart
      e.target.reset(); // Clear the form
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Failed to place order.');
    }
  };

  return (
    <div className="App">
      {/* HEADER */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#home">Tasty<span style={{ color: '#e74c3c' }}>Bites</span></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#menu">Menu</Nav.Link>
              <Nav.Link href="#gallery">Gallery</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
              <Nav.Link href="#cart" className="btn btn-primary-custom text-white px-3 ms-2">
                <i className="fas fa-shopping-cart"></i> Cart ({cart.length})
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
{/* POP-UP NOTIFICATION */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999, position: 'fixed' }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="success">
          <Toast.Header>
            <strong className="me-auto">TastyBites</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body className="text-white">Item added to cart successfully!</Toast.Body>
        </Toast>
      </ToastContainer>
      {/* HERO */}
      <section id="home" className="hero-section">
        <Container>
          <h1 className="display-3 fw-bold">Welcome to TastyBites</h1>
          <p className="lead">Experience the finest cuisine in a cozy atmosphere.</p>
          <Button href="#menu" className="btn-primary-custom btn-lg mt-3">View Our Menu</Button>
        </Container>
      </section>

      {/* MENU - Now renders data from State (MongoDB) */}
      <section id="menu" className="section-padding">
        <Container>
          <div className="text-center mb-5">
            <h2>Our Menu</h2>
            <p className="text-muted">Delicious dishes made with the finest ingredients</p>
          </div>
          <Table hover responsive className="shadow-sm">
            <thead className="bg-danger text-white">
              <tr>
                <th>Dish</th>
                <th>Description</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-bold">{item.name}</td>
                    <td>{item.desc}</td>
                    <td className="price-tag">${item.price}</td>
                    <td>
                      <Button size="sm" className="btn-primary-custom" onClick={() => addToCart(item)}>
                        Add to Cart
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center p-4">Loading Menu... (Make sure Backend is running)</td></tr>
              )}
            </tbody>
          </Table>
        </Container>
      </section>

      {/* CART */}
      <section id="cart" className="section-padding bg-light">
        <Container>
          <h2 className="text-center mb-4">Your Shopping Cart</h2>
          <Card className="p-4 shadow-sm">
            {cart.length === 0 ? (
              <p className="text-center">Your cart is currently empty.</p>
            ) : (
              <>
                <ul className="list-group list-group-flush">
                  {cart.map((item) => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{item.name}</strong> <br />
                        <small className="text-muted">Qty: {item.quantity} x ${item.price}</small>
                      </div>
                      <div>
                        <span className="fw-bold me-3">${(item.price * item.quantity).toFixed(2)}</span>
                        <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>Remove</Button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  <h3>Total: ${cartTotal}</h3>
                  <Button variant="dark" onClick={() => setCart([])}>Clear Cart</Button>
                </div>
              </>
            )}
          </Card>
        </Container>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="section-padding">
        <Container>
          <h2 className="text-center mb-4">Our Gallery</h2>
          <Carousel>
            {galleryImages.map((img, index) => (
              <Carousel.Item key={index}>
                <img className="d-block w-100" src={`${img.src}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80`} alt={img.caption} />
                <Carousel.Caption>
                  <h3>{img.caption}</h3>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* CONTACT & CHECKOUT FORM */}
      <section id="contact" className="section-padding bg-light">
        <Container>
          <Row>
            <Col md={6} className="mb-4">
              <h2>About Us</h2>
              <p>Founded in 2010, TastyBites is a family-owned restaurant dedicated to serving delicious homemade meals.</p>
              <div className="ratio ratio-4x3 mt-4 rounded overflow-hidden shadow-sm">
                 <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.9851310845937!3d40.74844097932881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629305229364!5m2!1sen!2sus" loading="lazy" title="Map"></iframe>
              </div>
            </Col>
            <Col md={6}>
              <Card className="p-4 shadow-sm">
                <h3>Contact / Checkout</h3>
                <p className="text-muted">Enter your details to place your order.</p>
                
                <Form onSubmit={handleCheckout}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Message / Instructions</Form.Label>
                    <Form.Control as="textarea" name="message" rows={3} />
                  </Form.Group>
                  <Button className="btn-primary-custom w-100" type="submit" disabled={cart.length === 0}>
                    {cart.length > 0 ? `Place Order ($${cartTotal})` : 'Add Items to Order'}
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white py-4 text-center">
        <Container>
          <p className="mb-0">© 2025 TastyBites Restaurant. All Rights Reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

export default App;