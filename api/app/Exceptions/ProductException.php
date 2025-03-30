<?php

namespace App\Exceptions;

use Exception;

class ProductException extends Exception
{
    protected array $context;

    public function __construct(string $message = "", int $code = 0, ?Exception $previous = null, array $context = [])
    {
        parent::__construct($message, $code, $previous);
    }

    public function getContext(): array
    {
        return $this->context;
    }
    public function addContext(string $key, $value): self
    {
        $this->context[$key] = $value;
        return $this;
    }

    public function __toString(): string
    {
        return __CLASS__ . ": [{$this->code}]: {$this->message} | " . json_encode($this->context, JSON_UNESCAPED_UNICODE) . "\n";
    }
}
