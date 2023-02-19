export interface Post {
    _id: string;
    _createdAt: string;
    title: string;
    author: {
        name: string;
        image: {
            asset: {
                _id: string;
                url: string;
            }
        }
    };
    comments: Comments[];
    description: string;
    mainImage: {
        asset: {
            _id: string;
            url: string;
        };
    };
    slug: {
        current: string;
    };
    body: [object];

}

export interface Comments {
    approved: boolean;
    comment: string;
    name: string;
    email: string;
    post: {
        _ref: string;
        _type: string;
    };
    _createdAt: string;
    _id: string;
    _rev: string;
    _type: string;
    _updatedAt: string;
}