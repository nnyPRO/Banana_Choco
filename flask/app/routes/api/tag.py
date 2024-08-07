# python lib

# my lib
from app.routes.api import api
from app.models.tag import Tag
from app.lib.request import successBody

@api.route("/tag", methods=["GET"])
def tag():
    tags = Tag.query.filter_by(is_deleted=False)
    tags = list(map(lambda x: x.to_dict(), tags))
    return successBody(tags)