<?php
// Set your receiving email address
$receiving_email_address = 'e.a.c.insurances@outlook.com';

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- 1. Get and Sanitize Form Data ---
    
    // Use trim() to remove whitespace from the beginning and end
    $name = trim(filter_var($_POST['name'], FILTER_SANITIZE_STRING));
    $email = trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL));
    $subject = trim(filter_var($_POST['subject'], FILTER_SANITIZE_STRING));
    $message = trim(filter_var($_POST['message'], FILTER_SANITIZE_STRING));
    
    // Check for the GDPR consent
    $gdpr_consent = isset($_POST['gdpr-consent']) ? $_POST['gdpr-consent'] : '';

    // --- 2. Validate Data ---
    
    // Check for empty fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        // Send an error message back to the form
        die('Please fill out all required fields.');
    }

    // Check for a valid email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die('Invalid email format.');
    }

    // Check if GDPR was checked
    if ($gdpr_consent != '1') {
        die('You must consent to the privacy policy.');
    }

    // --- 3. Build the Email ---

    // Subject line for the email you receive
    $email_subject = "New Contact Form Message: " . $subject;

    // The body of the email you receive
    $email_body = "You have received a new message from your website contact form.\n\n";
    $email_body .= "Name: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Insurance Type: $subject\n\n";
    $email_body .= "Message:\n$message\n";

    // Email headers
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // --- 4. Send the Email ---

    // Use PHP's built-in mail() function
    if (mail($receiving_email_address, $email_subject, $email_body, $headers)) {
        // Send "OK" to the validate.js script.
        // This is what triggers the green "Your message has been sent" box.
        echo "OK";
    } else {
        // Send an error message
        die('Message could not be sent. Please try again later.');
    }

} else {
    // Not a POST request
    die('Invalid request.');
}
?>