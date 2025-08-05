import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our custom pet rugs? We're here to help! 
            Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>Email Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <p className="font-medium">support@petrugs.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>Call Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  Speak with our customer service team.
                </p>
                <p className="font-medium">1-800-PET-RUGS</p>
                <p className="text-sm text-muted-foreground">(1-800-738-7847)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Business Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  Proudly made in the USA
                </p>
                <p className="text-sm">
                  123 Pet Lover Lane<br />
                  Custom City, CC 12345<br />
                  United States
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">How long does it take to create a custom rug?</h3>
                    <p className="text-muted-foreground">
                      Most custom rugs are completed within 5-7 business days. Rush orders are available for an additional fee.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">What photo quality do you recommend?</h3>
                    <p className="text-muted-foreground">
                      For best results, use high-resolution photos (at least 1000x1000 pixels) with good lighting and clear focus on your pet.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Can I make changes to my order after placing it?</h3>
                    <p className="text-muted-foreground">
                      Changes can be made within 24 hours of placing your order. After production begins, changes may not be possible.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Do you offer international shipping?</h3>
                    <p className="text-muted-foreground">
                      Currently, we only ship within the United States. International shipping may be available in the future.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;