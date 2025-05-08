# eMutua Digital E-commerce

## Introduction

This is a web application for product management for eMutua Digital. The application uses Laravel on the backend, with Laravel Sanctum for authentication, OpenSearch for product indexing to enable advanced searches, and Redis for data caching to optimize database usage and response times. The frontend is built with Next.js, TailwindCSS, DaisyUI (a TailwindCSS plugin), and SWR. The entire application is containerized using Docker.

## Documentation

### Installation and Configuration

First, clone the repository:

```shell
git clone https://github.com/imx0r/ecommerce-emutua.git
```

Install [Docker](https://www.docker.com/products/docker-desktop/) if it is not already installed on your machine.

Navigate to the `api` folder, duplicate the `.env.example` file and rename it to `.env`. Now, the application's infrastructure is ready.

Open the terminal/command prompt in the directory where you cloned the repository. To verify that it's the correct directory, check if it contains the `docker-compose.yml` file. Now type and press enter:

```
docker-compose up --build -d
```

Wait for all containers to build and start running. There are 6 in total:

| Container    | Port                                 | Description                                                                                                       |
| ------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `nginx`      | `80` (internal), `8000` (external)   | Nginx instance acting as a web server and load balancer for the application.                                      |
| `api`        | `9000` (internal, php-fpm)           | Laravel application, the API itself.                                                                              |
| `app`        | `3000`                               | Next.js application, the frontend.                                                                                |
| `mysql`      | `3308`                               | MySQL instance acting as the main database.                                                                       |
| `opensearch` | `9200` (internal), `9202` (external) | OpenSearch instance for indexing products and performing advanced searches.                                       |
| `redis`      | `6381` (internal)                    | Redis instance acting as the main caching engine, implementing database query caching to optimize response times. |

After the containers are built and running, if you have Docker Desktop, click on the `api` container and go to the `Exec` tab. If you are using Docker only through the terminal/CLI, run the following command to open a bash terminal inside the container:

```shell
docker run -it ecommerce-api bash
```

Then execute the following commands in this order:

1. Run the migrations to create the tables in the MySQL database:

```shell
php artisan migrate
```

2. Create the Doctrine-managed entity tables and generate the proxies:

```shell
php artisan doctrine:schema:create
php artisan doctrine:generate:proxies
```

3. Populate the database tables with initial test data:

```shell
php artisan db:seed
```

After executing all the commands above, you can access the application at `http://localhost:3000`.

Although it was not explicitly requested, I implemented a simple authentication system using Laravel Sanctum. Two default users have been created to demonstrate the application's authentication.

| User    | Password   |
| ------- | ---------- |
| `admin` | `p@ass`    |
| `user`  | `password` |

Users can log in at `http://localhost:3000/login` and can also register at `http://localhost:3000/register`. The default permission level is user (`1`), so if you want an administrator user, simply change the `role` field in the `users` table to `2`.

That's it! The application is configured and running.

### How do I manage products?

To demonstrate both authentication and authorization, only administrator users can manage products (create, edit, and delete). Therefore, first, go to `http://localhost:3000/login` and log in with the username `admin` and password `p@ass`. Once redirected, click on the "Admin" menu and then "Products."

You will be taken to a page with a product listing, where each product has an edit (pencil) and delete (trash) icon. There is also a "Create Product" button, which allows you to add a new product.

### How do I test product search in OpenSearch?

To test this, you need a tool that can make HTTP `GET` requests, such as Postman or cURL.

Open your preferred tool and make a request to the following URL:

```
http://localhost:9202/products/_search
```

If you are using cURL, just run:

```shell
curl --location --max-time 300 --request GET 'http://localhost:9202/products/_search'
```

### How do I test the API routes in Postman?

To test the API routes, simply go to the `test` folder and import the collection and environment files into your Postman.

## Technologies (Stack)

**Backend:**

* PHP 8.2
* Nginx 1.27.4
* Laravel 12

  * Laravel Sanctum
* Doctrine ORM
* MySQL 8.0
* OpenSearch v2
* Redis 7.4

**Frontend:**

* Next.js (React) 15.2
* TailwindCSS v4
* DaisyUI v5
* SWR v2

**CI/CD**

* Docker

## Solution Implementation

The choice of technologies followed the given requirements. Although I have been using Laravel for many years, as well as Next.js (React) and all the mentioned technologies, I have less experience with OpenSearch.

In the implementation, I chose to explore and incorporate other aspects and technologies, such as using Redis for caching, implementing authentication with Laravel Sanctum, and role-based authorization.

Initially, I chose to integrate Redis mainly because it is a caching engine that I have been using for a long time, to optimize database resources, improve response times, and leverage its excellent integration with Laravel. I also aimed to define responsibilities clearly for both OpenSearch and Redis.

Both OpenSearch and Redis have caching mechanisms, but I decided to keep OpenSearch focused on product indexing for fast searches and use Redis for application optimization, database optimization, queue management, and session management. In an e-commerce platform, you can have thousands of users accessing the same product page simultaneously, so clearly defining the role of each tool — OpenSearch for product searches and listings, and Redis for caching products, users, and top products in a category — can save resources and provide a better user experience.

Regarding authentication and authorization, the implementation was essential to demonstrate mastery of these two critical features for any web management application.

## Final Considerations

Developing this project was both fun and productive. I always enjoy practicing and building, even small projects, as it challenges me and helps ensure my skills are up to date. It is always a great learning experience. Thank you for the opportunity, and see you soon!
