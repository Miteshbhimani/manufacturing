{
    'name': 'Headless CMS Integration',
    'version': '1.0',
    'summary': 'Dynamic Website Content Models for Headless React App',
    'author': 'Nexus Manufacturing API',
    'category': 'Website',
    'depends': ['base'],
    'data': [
        'security/ir.model.access.csv',
        'views/page_views.xml',
        'views/section_views.xml',
        'views/menu_views.xml',
    ],
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
