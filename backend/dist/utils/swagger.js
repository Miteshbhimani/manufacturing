"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = exports.swaggerUiOptions = exports.specs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// Swagger configuration
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Nucleus Metal Cast API',
            version: '1.0.0',
            description: 'API documentation for Nucleus Metal Cast manufacturing website',
            contact: {
                name: 'API Support',
                email: 'support@nucleusmetalcast.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            },
            {
                url: 'https://api.nucleusmetalcast.com',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Indicates if the request was successful'
                        },
                        data: {
                            type: 'object',
                            description: 'Response data'
                        },
                        message: {
                            type: 'string',
                            description: 'Response message'
                        },
                        error: {
                            type: 'string',
                            description: 'Error message if success is false'
                        }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'Product ID'
                        },
                        name: {
                            type: 'string',
                            description: 'Product name'
                        },
                        description: {
                            type: 'string',
                            description: 'Product description'
                        },
                        description_sale: {
                            type: 'string',
                            description: 'Sales description'
                        },
                        list_price: {
                            type: 'number',
                            description: 'Product price'
                        },
                        categ_id: {
                            type: 'array',
                            items: {
                                type: 'object'
                            },
                            description: 'Product category'
                        },
                        image_1920: {
                            type: 'string',
                            description: 'Product image URL'
                        }
                    }
                },
                LeadRequest: {
                    type: 'object',
                    required: ['fullName', 'companyName', 'email', 'phone', 'message'],
                    properties: {
                        fullName: {
                            type: 'string',
                            description: 'Full name'
                        },
                        companyName: {
                            type: 'string',
                            description: 'Company name'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email address'
                        },
                        phone: {
                            type: 'string',
                            description: 'Phone number'
                        },
                        message: {
                            type: 'string',
                            description: 'Message'
                        },
                        userId: {
                            type: 'number',
                            description: 'User ID (optional)'
                        }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email address'
                        },
                        password: {
                            type: 'string',
                            description: 'Password'
                        },
                        isRegistering: {
                            type: 'boolean',
                            description: 'Set to true for registration'
                        }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean'
                        },
                        data: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'number',
                                    description: 'User ID'
                                },
                                name: {
                                    type: 'string',
                                    description: 'User name'
                                },
                                email: {
                                    type: 'string',
                                    description: 'User email'
                                },
                                role: {
                                    type: 'string',
                                    enum: ['admin', 'user'],
                                    description: 'User role'
                                },
                                token: {
                                    type: 'string',
                                    description: 'JWT token'
                                },
                                expiresIn: {
                                    type: 'string',
                                    description: 'Token expiration time'
                                }
                            }
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        error: {
                            type: 'string',
                            description: 'Error message'
                        },
                        data: {
                            type: 'object',
                            properties: {
                                stack: {
                                    type: 'string',
                                    description: 'Error stack trace (development only)'
                                },
                                url: {
                                    type: 'string',
                                    description: 'Request URL'
                                },
                                method: {
                                    type: 'string',
                                    description: 'HTTP method'
                                }
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Products',
                description: 'Product management operations'
            },
            {
                name: 'Leads',
                description: 'Lead management operations'
            },
            {
                name: 'Authentication',
                description: 'User authentication operations'
            },
            {
                name: 'Pages',
                description: 'CMS page operations'
            },
            {
                name: 'Health',
                description: 'Health check and system status'
            }
        ]
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API docs
};
// Generate swagger specification
exports.specs = (0, swagger_jsdoc_1.default)(options);
// Swagger UI configuration
exports.swaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Nucleus Metal Cast API Documentation',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        docExpansion: 'none',
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2
    }
};
// API documentation endpoint
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve);
    app.get('/api-docs', swagger_ui_express_1.default.setup(exports.specs, exports.swaggerUiOptions));
    // JSON specification endpoint
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(exports.specs);
    });
};
exports.setupSwagger = setupSwagger;
