from odoo import models, fields

class HeadlessSection(models.Model):
    _name = 'headless.section'
    _description = 'Headless Page Section'
    _order = 'sequence, id'

    name = fields.Char(string='Section Internal Name', required=True)
    page_id = fields.Many2one('headless.page', string='Page', required=True, ondelete='cascade')
    sequence = fields.Integer(string='Sequence', default=10)
    
    component_type = fields.Selection([
        ('hero', 'Hero Section'),
        ('text_image', 'Text & Image Block'),
        ('capabilities_grid', 'Capabilities Grid'),
        ('trust_bar', 'Trust Factors Bar'),
        ('contact_form', 'Contact Form'),
        ('product_showcase', 'Product Showcase')
    ], string='Component Type', required=True, default='hero')

    title = fields.Char(string='Title Text')
    subtitle = fields.Char(string='Subtitle Text')
    content = fields.Html(string='HTML Content')
    image_1920 = fields.Image(string='Background/Hero Image (1920)')
    button_text = fields.Char(string='Button Text')
    button_link = fields.Char(string='Button Link')
    
    extra_json_data = fields.Text(string='Extra JSON Payload', help='Use this for complex dynamic arrays passing to React')
