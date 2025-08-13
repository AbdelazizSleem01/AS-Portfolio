import connectDB from "../../../../lib/mongodb";
import Contact from "../../../../models/Contact";

// GET: Retrieve all contact messages
export async function GET(request) {
  await connectDB();
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    return new Response(JSON.stringify(contacts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST: Create a new contact message
export async function POST(request) {
  await connectDB();
  const { name, email, subject, message } = await request.json();

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return new Response(
      JSON.stringify({ message: 'Missing required fields' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    return new Response(
      JSON.stringify({
        message: 'Contact message saved successfully!',
        contactId: newContact._id,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error saving contact message:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
