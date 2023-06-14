from sqlalchemy_utils import Timestamp
from app.extensions import db


class Products(db.Model, Timestamp):
    """
    Provider- Products database model.
    """
    __tablename__ = 'products'
    name = db.Column(db.String(length=120),nullable=False)
    description = db.Column(db.String(length=500),nullable=True)
    product_code = db.Column(db.String(length=120),nullable=False)
    reference_id = db.Column(db.String(length=120),nullable=False)
    type = db.Column(db.String(length=120),nullable=False)
    cost_per_unit = db.Column(db.String(length=120),nullable=False)
    unit = db.Column(db.String(length=120),nullable=False)



    def __repr__(self):
        return (
            "<{class_name}("
            "name={self.name}, "
            "description={self.description}, "
            "product_code=\"{self.product_code}\", "
            "reference_id=\"{self.reference_id}\", "
            "type=\"{self.type}\", "
            "cost_per_unit=\"{self.cost_per_unit}\", "
            "unit=\"{self.unit}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )


