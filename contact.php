<?php
header('Content-Type: application/json; charset=utf-8');

// Enable error logging (but don't display errors to users)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Response array
$response = array('success' => false, 'message' => '');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode($response);
    exit;
}

// Define allowed fields
$allowedFields = array('firstName', 'lastName', 'company', 'position', 'email', 'phone', 'website', 'message');

// Initialize validated data
$validatedData = array();

// Validate and sanitize each field
foreach ($allowedFields as $field) {
    if (!isset($_POST[$field])) {
        $response['message'] = 'Missing required field: ' . htmlspecialchars($field);
        http_response_code(400);
        echo json_encode($response);
        exit;
    }

    // Sanitize: Remove leading/trailing whitespace and get only the first 1000 characters
    $value = trim(substr($_POST[$field], 0, 1000));

    // Remove null bytes and other potentially dangerous characters
    $value = str_replace("\0", '', $value);

    // Validate based on field type
    if ($field === 'firstName' || $field === 'lastName') {
        if (strlen($value) < 2) {
            $response['message'] = 'Validation error in ' . htmlspecialchars($field);
            http_response_code(400);
            echo json_encode($response);
            exit;
        }
        // Allow only letters, spaces, hyphens, and apostrophes
        if (!preg_match('/^[a-zA-Z\s\-\']+$/', $value)) {
            $response['message'] = 'Validation error in ' . htmlspecialchars($field);
            http_response_code(400);
            echo json_encode($response);
            exit;
        }
    } elseif ($field === 'email') {
        if (empty($value)) {
            $response['message'] = 'Email is required';
            http_response_code(400);
            echo json_encode($response);
            exit;
        }
        // Validate email format
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $response['message'] = 'Invalid email address';
            http_response_code(400);
            echo json_encode($response);
            exit;
        }
        // Additional check: limit email length to prevent excessively long emails
        if (strlen($value) > 254) {
            $response['message'] = 'Email address is too long';
            http_response_code(400);
            echo json_encode($response);
            exit;
        }
    } elseif ($field === 'phone') {
        if (strlen($value) < 1) {
            $response['message'] = 'Phone is required';
            http_response_code(400);
            echo json_encode($response);
            exit;
        }
        // Allow only digits, spaces, hyphens, plus signs, and parentheses
        if (!preg_match('/^[0-9\s\-\+\(\)]+$/', $value)) {
            $response['message'] = 'Invalid phone number format';
            http_response_code(400);
            echo json_encode($response);
            exit;
        }
    } elseif ($field === 'website') {
        if (strlen($value) < 1) {
            $response['message'] = 'Website is required';
            http_response_code(400);
            echo json_encode($response);
            exit;
        }
        // Validate URL format (basic check)
        if (!preg_match('/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/', $value)) {
            $response['message'] = 'Invalid website URL format';
            http_response_code(400);
            echo json_encode($response);
            exit;
        }
    } else {
        // For company, position, and message: require at least 1 character
        if (strlen($value) < 1) {
            $response['message'] = 'All fields are required';
            http_response_code(400);
            echo json_encode($response);
            exit;
        }
    }

    // Store validated data
    $validatedData[$field] = $value;
}

// Prepare email content
$to = 'info.gr@skynet.be';
$subject = 'New Contact Form Submission from ' . htmlspecialchars($validatedData['firstName']) . ' ' . htmlspecialchars($validatedData['lastName']);

// Build email body with proper escaping
$emailBody = "New contact form submission:\n\n";
$emailBody .= "First Name: " . htmlspecialchars($validatedData['firstName']) . "\n";
$emailBody .= "Last Name: " . htmlspecialchars($validatedData['lastName']) . "\n";
$emailBody .= "Company: " . htmlspecialchars($validatedData['company']) . "\n";
$emailBody .= "Position: " . htmlspecialchars($validatedData['position']) . "\n";
$emailBody .= "Email: " . htmlspecialchars($validatedData['email']) . "\n";
$emailBody .= "Phone: " . htmlspecialchars($validatedData['phone']) . "\n";
$emailBody .= "Website: " . htmlspecialchars($validatedData['website']) . "\n";
$emailBody .= "Message:\n" . htmlspecialchars($validatedData['message']) . "\n";
$emailBody .= "\n---\n";
$emailBody .= "Submitted on: " . date('Y-m-d H:i:s') . "\n";
$emailBody .= "IP Address: " . htmlspecialchars($_SERVER['REMOTE_ADDR']) . "\n";

// Set email headers
$headers = array(
    'From' => 'noreply@gerbehaye-hubert.be',
    'Reply-To' => htmlspecialchars($validatedData['email']),
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=utf-8'
);

// Build headers string
$headerString = '';
foreach ($headers as $key => $value) {
    $headerString .= $key . ': ' . $value . "\r\n";
}

// Additional security: verify sender email is valid before sending
if (!filter_var($validatedData['email'], FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'Invalid sender email address';
    http_response_code(400);
    echo json_encode($response);
    exit;
}

// Send email
// Use proper escaping for the subject
$subject = str_replace(array("\r", "\n"), '', $subject);

if (mail($to, $subject, $emailBody, $headerString)) {
    // Email sent successfully
    $response['success'] = true;
    $response['message'] = 'Your message has been sent successfully';
    http_response_code(200);
} else {
    // Email sending failed
    $response['message'] = 'An error occurred while sending your message';
    http_response_code(500);
}

echo json_encode($response);
exit;
?>
